APP_NAME=rdm-sovereign-proxy
VERSION=1.0.0-soberania
BUILD_DIR=./bin

build-all: build-linux-amd64 build-linux-arm64

build-linux-amd64:
	@echo "[KRNL] Compilando Binario para Linux AMD64 (Edge Server)..."
	@mkdir -p $(BUILD_DIR)
	GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s -X main.version=$(VERSION)" -o $(BUILD_DIR)/$(APP_NAME)-linux-amd64 cmd/sovereign-proxy/main.go

build-linux-arm64:
	@echo "[KRNL] Compilando Binario para Linux ARM64 (Micro-Nodos de Federación)..."
	@mkdir -p $(BUILD_DIR)
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-w -s -X main.version=$(VERSION)" -o $(BUILD_DIR)/$(APP_NAME)-linux-arm64 cmd/sovereign-proxy/main.go

deploy-schema:
	@echo "[KRNL] Inyectando Esquema Espacial en Base de Datos Local..."
	psql -U anubis_admin -d rdm_digital_os -h localhost -p 5432 -f 001_kernel_civilizatorio_init.sql

clean:
	@echo "Limpiando binarios antiguos..."
	rm -rf $(BUILD_DIR)/*
