import { createClient } from "@/lib/supabase/server"
import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function TomoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: tomo }, { data: chapters }] = await Promise.all([
    supabase.from("manuscripts").select("*").eq("id", id).single(),
    supabase.from("chapters").select("*").eq("manuscript_id", id).order("number"),
  ])

  if (!tomo) notFound()

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/40">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <Link
              href="/manuscrito"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent"
            >
              ← Manuscrito
            </Link>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mt-6 mb-4">
              Tomo {tomo.tomo_number} · {tomo.status.replace("_", " ")}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground text-balance mb-4 leading-[1.05]">
              {tomo.title}
            </h1>
            <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-8">{tomo.subtitle}</p>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{tomo.description}</p>
            <div className="mt-10 pt-6 border-t border-border/40 flex flex-wrap gap-x-12 gap-y-3 font-mono text-xs text-muted-foreground">
              <span>
                Autor: <span className="text-foreground">{tomo.author}</span>
              </span>
              <span>
                Identidad ritual: <span className="text-foreground">{tomo.ritual_name}</span>
              </span>
              <span>
                ORCID: <span className="text-accent">{tomo.orcid}</span>
              </span>
              <span>
                Palabras: <span className="text-foreground">{(tomo.word_count ?? 0).toLocaleString("es-MX")}</span>
              </span>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="font-serif text-2xl text-foreground mb-8">Capítulos</h2>
          {(chapters ?? []).length === 0 ? (
            <div className="border border-dashed border-border/60 p-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Capítulos en proceso
              </p>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                El borrador de este tomo está siendo redactado y firmado criptográficamente con SHA-256 antes de su
                publicación pública. Sigue el avance en{" "}
                <a href="https://tamvonlinenetwork.blogspot.com" className="text-accent underline-offset-4 hover:underline">
                  el blog TAMV
                </a>
                .
              </p>
            </div>
          ) : (
            <ul className="space-y-px bg-border/40 border border-border/40">
              {(chapters ?? []).map((c) => (
                <li key={c.id} className="bg-card p-6">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="font-serif text-lg text-foreground">
                      {c.number}. {c.title}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {(c.word_count ?? 0).toLocaleString("es-MX")} palabras
                    </span>
                  </div>
                  {c.excerpt ? <p className="text-sm text-muted-foreground leading-relaxed">{c.excerpt}</p> : null}
                  {c.hash_sha256 ? (
                    <p className="mt-3 font-mono text-[10px] text-accent break-all">SHA-256 · {c.hash_sha256}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
