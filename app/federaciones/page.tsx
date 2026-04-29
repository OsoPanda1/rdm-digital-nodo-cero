import { createClient } from "@/lib/supabase/server"
import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import Link from "next/link"
import type { Federation } from "@/lib/types"

export const metadata = {
  title: "Las 7 Federaciones — RDM Digital",
  description: "Estructura federada del Nodo Cero: Educativa, Cultural, Económica, Tecnológica, Salud, Comunicación, Gubernamental.",
}

export default async function FederacionesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("federations").select("*").eq("active", true).order("id")
  const federations = (data ?? []) as Federation[]

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/40">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">II · ESTRUCTURA FEDERADA</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground text-balance mb-6 leading-[1.05]">
              Las 7 Federaciones del Nodo Cero
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Cada federación es una jurisdicción operativa autónoma, interconectada por el Kernel TAMV y auditada por el log EOCT. Ningún dominio se reduce a otro.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-px bg-border/40 border border-border/40">
            {federations.map((f, i) => (
              <Link
                key={f.id}
                href={`/federaciones/${f.id}`}
                className="bg-card p-8 hover:bg-card/60 transition-colors group"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono text-xs text-muted-foreground">F0{i + 1}</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-accent">{f.domain}</span>
                </div>
                <h2 className="font-serif text-2xl text-foreground mb-2 group-hover:text-accent transition-colors">
                  {f.name}
                </h2>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">{f.motto}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{f.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(f.modules ?? []).map((m) => (
                    <span
                      key={m}
                      className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 border border-border/60 text-muted-foreground"
                    >
                      {m}
                    </span>
                  ))}
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
