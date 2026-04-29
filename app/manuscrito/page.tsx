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

const PAGE_SIZE = 6

export default async function ManuscritoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: rawPage } = await searchParams
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1)
  const offset = (page - 1) * PAGE_SIZE
  const supabase = await createClient()
  const { data, count } = await supabase
    .from("manuscripts")
    .select("*", { count: "exact" })
    .order("tomo_number")
    .range(offset, offset + PAGE_SIZE - 1)
  const tomos = (data ?? []) as Manuscript[]
  const total = tomos.reduce((s, t) => s + (t.word_count ?? 0), 0)
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))

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
                <p className="text-3xl text-accent">{count ?? tomos.length}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Tomos totales</p>
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
          <div className="mb-6 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>
              Página {page} / {totalPages}
            </span>
            <span>{tomos.length} tomos en esta vista</span>
          </div>
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
          <div className="mt-8 flex items-center justify-between gap-3">
            <Link
              href={page > 1 ? `/manuscrito?page=${page - 1}` : "#"}
              aria-disabled={page <= 1}
              className={`rounded-md border px-4 py-2 text-sm ${
                page <= 1
                  ? "pointer-events-none border-border/40 text-muted-foreground/50"
                  : "border-accent/40 text-accent hover:bg-accent/10"
              }`}
            >
              ← Anterior
            </Link>
            <Link
              href={page < totalPages ? `/manuscrito?page=${page + 1}` : "#"}
              aria-disabled={page >= totalPages}
              className={`rounded-md border px-4 py-2 text-sm ${
                page >= totalPages
                  ? "pointer-events-none border-border/40 text-muted-foreground/50"
                  : "border-accent/40 text-accent hover:bg-accent/10"
              }`}
            >
              Siguiente →
            </Link>
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
