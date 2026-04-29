import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import { fetchGitHubRepos, fetchGitHubUser, classifyRepo } from "@/lib/github"
import Link from "next/link"

export const metadata = {
  title: "Repositorio Evolutivo — RDM Digital",
  description: "Sincronización en vivo con GitHub OsoPanda1 como base de datos evolutiva del Nodo Cero.",
}

export const revalidate = 1800

export default async function RepositorioPage() {
  const [user, repos] = await Promise.all([fetchGitHubUser(), fetchGitHubRepos()])

  const enriched = repos
    .filter((r) => !r.fork)
    .map((r) => ({ ...r, ...classifyRepo(r) }))
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())

  const byFed: Record<string, typeof enriched> = {}
  for (const r of enriched) {
    byFed[r.federation] = byFed[r.federation] ?? []
    byFed[r.federation].push(r)
  }

  const fedNames: Record<string, string> = {
    educativa: "Educativa",
    cultural: "Cultural",
    economica: "Económica",
    tecnologica: "Tecnológica",
    salud: "Salud",
    comunicacion: "Comunicación",
    gubernamental: "Gubernamental",
  }

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/40">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">VI · REPOSITORIO EVOLUTIVO</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground text-balance mb-6 leading-[1.05]">
              GitHub <span className="text-accent">OsoPanda1</span> como base de datos evolutiva
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-8">
              Cada repositorio es un nodo de investigación clasificado por federación. Sincronización en vivo,
              clasificación automática, lectura pública. La memoria operativa del Real del Monte Digital vive en Git.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-border/40">
              <Stat label="Repositorios" value={user?.public_repos ?? enriched.length} />
              <Stat label="Seguidores" value={user?.followers ?? 0} />
              <Stat label="Activos" value={enriched.length} />
              <Stat label="Federaciones" value={Object.keys(byFed).length} />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          {Object.entries(byFed).map(([fed, list]) => (
            <div key={fed} className="mb-16">
              <div className="flex items-baseline justify-between mb-6 border-b border-border/40 pb-3">
                <h2 className="font-serif text-2xl text-foreground">Federación {fedNames[fed] ?? fed}</h2>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {list.length} nodos
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-px bg-border/40 border border-border/40">
                {list.map((r) => (
                  <a
                    key={r.id}
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-card p-6 hover:bg-card/60 transition-colors group block"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        {r.classification}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        ★ {r.stargazers_count} · {r.language ?? "—"}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors mb-2">
                      {r.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[2.5em]">
                      {r.description ?? "Sin descripción."}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(r.topics ?? []).slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-border/60 text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 font-mono text-[10px] text-muted-foreground">
                      Push:{" "}
                      {new Date(r.pushed_at).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {enriched.length === 0 ? (
            <div className="border border-dashed border-border/60 p-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Sin sincronización</p>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                No fue posible alcanzar la API pública de GitHub. La caché regresa en 30 minutos.
              </p>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card p-6">
      <p className="font-mono text-3xl text-foreground">{value}</p>
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
