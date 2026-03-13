package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

type AutopoiesisEvent struct {
	Zona    string  `json:"zona"`
	Presion float64 `json:"presion"`
	Accion  string  `json:"accion"`
}

var (
	localDB  *sql.DB
	cloudURL *url.URL
)

func main() {
	initDatabase()
	defer localDB.Close()

	cloudHost := envOrDefault("CLOUD_URL", "https://cloud.tamv.network")
	cloud, err := url.Parse(cloudHost)
	if err != nil {
		log.Fatal("Error parseando URL de nube:", err)
	}
	cloudURL = cloud

	go listenPostGISEvents()

	proxy := httputil.NewSingleHostReverseProxy(cloudURL)
	proxy.Director = func(req *http.Request) {
		req.Header.Add("X-RDM-Edge-Node", "Active")
		req.URL.Scheme = cloudURL.Scheme
		req.URL.Host = cloudURL.Host
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		hybridHandler(w, r, proxy)
	})

	port := envOrDefault("PORT", "8080")
	log.Printf("[KERNEL] Proxy Soberano operando en el puerto :%s. Modo: Edge-First.", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func hybridHandler(w http.ResponseWriter, r *http.Request, cloudProxy *httputil.ReverseProxy) {
	if strings.HasPrefix(r.URL.Path, "/api/v1/kernel/nodos-cercanos") {
		handleLocalSpatialQuery(w, r)
		return
	}

	cloudProxy.ServeHTTP(w, r)
}

func handleLocalSpatialQuery(w http.ResponseWriter, r *http.Request) {
	lat := r.URL.Query().Get("lat")
	lng := r.URL.Query().Get("lng")
	radioMts := r.URL.Query().Get("radio")

	if _, err := strconv.ParseFloat(lat, 64); err != nil {
		http.Error(w, "lat inválida", http.StatusBadRequest)
		return
	}
	if _, err := strconv.ParseFloat(lng, 64); err != nil {
		http.Error(w, "lng inválida", http.StatusBadRequest)
		return
	}
	if _, err := strconv.Atoi(radioMts); err != nil {
		http.Error(w, "radio inválido", http.StatusBadRequest)
		return
	}

	query := `
		SELECT id, nombre, federacion
		FROM nodos_lsm
		WHERE activo = true
		AND ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3);
	`
	rows, err := localDB.Query(query, lng, lat, radioMts)
	if err != nil {
		http.Error(w, "Error procesando geometría", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var resultados []map[string]interface{}
	for rows.Next() {
		var id, nombre, federacion string
		if err := rows.Scan(&id, &nombre, &federacion); err != nil {
			continue
		}
		resultados = append(resultados, map[string]interface{}{
			"id": id, "nombre": nombre, "federacion": federacion,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resultados)
}

func initDatabase() {
	var err error
	connStr := os.Getenv("DATABASE_URL")
	localDB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Fallo catastrófico al conectar con el Kernel PostGIS:", err)
	}
	localDB.SetMaxOpenConns(50)
	localDB.SetMaxIdleConns(10)
}

func listenPostGISEvents() {
	conninfo := os.Getenv("DATABASE_URL")
	listener := pq.NewListener(conninfo, 10*time.Second, time.Minute, func(_ pq.ListenerEventType, err error) {
		if err != nil {
			log.Println("Error en el bus de eventos PostGIS:", err)
		}
	})

	if err := listener.Listen("canal_autopoiesis"); err != nil {
		panic(err)
	}

	log.Println("[AUTOPOIESIS] Escuchando eventos espaciales en tiempo real...")
	for {
		select {
		case n := <-listener.Notify:
			if n == nil {
				continue
			}
			var event AutopoiesisEvent
			_ = json.Unmarshal([]byte(n.Extra), &event)
			log.Printf("[ALERTA KERNEL] Zona %s en Presión: %.2f. Ejecutando Acción: %s", event.Zona, event.Presion, event.Accion)
		}
	}
}

func envOrDefault(name, fallback string) string {
	value := strings.TrimSpace(os.Getenv(name))
	if value == "" {
		return fallback
	}
	return value
}
