import { createClient } from "@/lib/supabase/server"
import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function FederationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: fed }, { data: pois }, { data: events }, { data: repos }] = await Promise.all([
    supabase.from("federations").select("*").eq("id", id).single(),
    supabase.from("territory_pois").select("*").eq("federation_id", id),
    supabase
      .from("events")
      .select("*")
      .eq("federation_id", id)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at"),
    supabase.from("repositories").select("*").eq("federation_id", id).order("pushed_at", { ascending: false }),
  ])

  if (!fed) notFound()

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/40">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <Link
              href="/federaciones"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent"
            >
              ← Federaciones
            </Link>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mt-6 mb-4">{fed.domain}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground text-balance mb-4 leading-[1.05]">
              {fed.name}
            </h1>
            <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-6">{fed.motto}</p>
            <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">{fed.description}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
          <div>
            <h2 className="font-serif text-xl text-foreground mb-4">Módulos operativos</h2>
            <ul className="space-y-2 font-mono text-sm">
              {(fed.modules ?? []).map((m: string) => (
                <li key={m} className="flex items-center gap-3 text-muted-foreground">
                  <span className="h-px w-4 bg-accent" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-xl text-foreground mb-4">Nodos territoriales</h2>
            <ul className="space-y-3">
              {(pois ?? []).map((p) => (
                <li key={p.id} className="text-sm">
                  <p className="text-foreground">{p.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {p.municipality} · {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                  </p>
                </li>
              ))}
              {(pois ?? []).length === 0 ? (
                <li className="font-mono text-xs text-muted-foreground">— sin nodos asignados</li>
              ) : null}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-xl text-foreground mb-4">Próximos eventos</h2>
            <ul className="space-y-3">
              {(events ?? []).map((e) => (
                <li key={e.id} className="text-sm">
                  <p className="text-foreground">{e.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {new Date(e.starts_at).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </li>
              ))}
              {(events ?? []).length === 0 ? (
                <li className="font-mono text-xs text-muted-foreground">— sin eventos programados</li>
              ) : null}
            </ul>
          </div>
        </section>

        {(repos ?? []).length > 0 ? (
          <section className="border-t border-border/40">
            <div className="max-w-6xl mx-auto px-6 py-16">
              <h2 className="font-serif text-2xl text-foreground mb-8">Repositorios federados</h2>
              <div className="grid md:grid-cols-2 gap-px bg-border/40 border border-border/40">
                {(repos ?? []).map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-card p-6 hover:bg-card/60 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs uppercase text-accent tracking-wider">{r.classification}</span>
                      <span className="font-mono text-xs text-muted-foreground">★ {r.stars}</span>
                    </div>
                    <h3 className="font-serif text-lg text-foreground mb-2">{r.full_name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
