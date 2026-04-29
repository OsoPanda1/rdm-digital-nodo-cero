import { createClient } from "@/lib/supabase/server"
import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import { TerritoryMap } from "@/components/rdm/territory-map"
import type { TerritoryPOI } from "@/lib/types"

export const metadata = {
  title: "Territorio Operativo — RDM Digital",
  description: "Cartografía simbólica y operativa del Real del Monte, Pachuca y Mineral del Chico.",
}

export default async function TerritorioPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("territory_pois").select("*").order("municipality")
  const pois = (data ?? []) as TerritoryPOI[]

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/40">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">III · TERRITORIO OPERATIVO</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground text-balance mb-6 leading-[1.05]">
              Real del Monte, Pachuca, Mineral del Chico
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Coordenadas reales (20.1432°N, 98.6694°W) sobre el Cinturón Volcánico Trans-Mexicano. El territorio no es metáfora: es jurisdicción.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <TerritoryMap pois={pois} />
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="font-serif text-2xl text-foreground mb-8">{pois.length} nodos del territorio</h2>
          <div className="grid md:grid-cols-2 gap-px bg-border/40 border border-border/40">
            {pois.map((p) => (
              <article key={p.id} className="bg-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{p.category}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-foreground mb-1">{p.name}</h3>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  {p.municipality}
                  {p.altitude_m ? ` · ${p.altitude_m} msnm` : ""}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{p.description}</p>
                {p.significance ? (
                  <p className="font-mono text-xs text-accent/80 mt-3">{p.significance}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
