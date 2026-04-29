import { createClient } from "@/lib/supabase/server"
import { fetchGitHubRepos, fetchGitHubUser } from "@/lib/github"
import Link from "next/link"

export async function LiveStatus() {
  const supabase = await createClient()
  const [
    { count: federations },
    { count: pois },
    { count: events },
    { count: manuscripts },
    { count: transactions },
    user,
    repos,
  ] = await Promise.all([
    supabase.from("federations").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("territory_pois").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("manuscripts").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("status", "paid"),
    fetchGitHubUser(),
    fetchGitHubRepos(),
  ])

  const stats = [
    { label: "Federaciones activas", value: String(federations ?? 7), suffix: "/ 7", href: "/federaciones" },
    { label: "Nodos territoriales", value: String(pois ?? 0), suffix: "POIs", href: "/territorio" },
    { label: "Tomos del Manuscrito", value: String(manuscripts ?? 0), suffix: "I–IV", href: "/manuscrito" },
    { label: "Repositorios OsoPanda1", value: String(repos.length), suffix: "live", href: "/repositorio" },
    { label: "Eventos próximos", value: String(events ?? 0), suffix: "agenda", href: "/federaciones" },
    { label: "Tributos confirmados", value: String(transactions ?? 0), suffix: "MXN", href: "/mercado" },
  ]

  return (
    <section id="estado" className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-baseline justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">Estado en vivo · Nodo Cero</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
              Datos reales sincronizados con Supabase + GitHub
            </h2>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" /> EN VIVO
            </span>
            {user ? (
              <span className="ml-4">
                GitHub: <span className="text-foreground">{user.login}</span> · {user.followers} seguidores
              </span>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border/40 border border-border/40">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="bg-background p-6 hover:bg-card/60 transition-colors">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{s.label}</p>
              <p className="font-serif text-3xl text-foreground">{s.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent mt-1">{s.suffix}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
