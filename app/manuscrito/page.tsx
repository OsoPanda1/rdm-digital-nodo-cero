import { createClient } from "@/lib/supabase/server"
import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import Link from "next/link"
import type { Manuscript } from "@/lib/types"

export const metadata = {
  title: "Manuscrito Digital — RDM Digital",
  description: "Tomos del Compendio TAMV / Libro Génesis. Edwin Oswaldo Castillo Trejo (Anubis Villaseñor).",
}

export default async function ManuscritoPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("manuscripts").select("*").order("tomo_number")
  const tomos = (data ?? []) as Manuscript[]
  const total = tomos.reduce((s, t) => s + (t.word_count ?? 0), 0)

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/40">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">IV · MANUSCRITO DIGITAL</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground text-balance mb-6 leading-[1.05]">
              Compendio TAMV — Libro Génesis
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-8">
              Cuatro tomos firmados por Edwin Oswaldo Castillo Trejo (identidad ritual: Anubis Villaseñor). ORCID 0009-0008-5050-1539. Licencia CC-BY-SA-NC-ND.
            </p>
            <div className="flex gap-12 font-mono text-sm">
              <div>
                <p className="text-3xl text-accent">{tomos.length}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Tomos</p>
              </div>
              <div>
                <p className="text-3xl text-accent">{total.toLocaleString("es-MX")}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Palabras</p>
              </div>
              <div>
                <p className="text-3xl text-accent">{tomos.filter((t) => t.status === "in_progress").length}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">En curso</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-px bg-border/40 border border-border/40">
            {tomos.map((t) => (
              <Link
                key={t.id}
                href={`/manuscrito/${t.id}`}
                className="block bg-card p-8 hover:bg-card/60 transition-colors group"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                        Tomo {romanize(t.tomo_number)}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl text-foreground mb-1 group-hover:text-accent transition-colors">
                      {t.title}
                    </h2>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
                      {t.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{t.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-2xl text-foreground">{(t.word_count ?? 0).toLocaleString("es-MX")}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">palabras</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function romanize(n: number) {
  const map: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII" }
  return map[n] ?? String(n)
}
