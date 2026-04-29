import Link from "next/link"
import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import { TourismAIAssistant } from "@/components/rdm/tourism-ai-assistant"
import { tourismSpots, type TourismCategory } from "@/lib/tourism-data"

const PAGE_SIZE = 3

export default async function TurismoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: TourismCategory }>
}) {
  const { page: rawPage, category } = await searchParams
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1)
  const filtered = category ? tourismSpots.filter((spot) => spot.category === category) : tourismSpots
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const offset = (safePage - 1) * PAGE_SIZE
  const spots = filtered.slice(offset, offset + PAGE_SIZE)

  const buildHref = (nextPage: number) =>
    `/turismo?page=${nextPage}${category ? `&category=${encodeURIComponent(category)}` : ""}`

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/40">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">RDM TURISMO · DIGITAL TWIN</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Explora Real del Monte en tiempo real</h1>
            <p className="max-w-3xl text-muted-foreground">
              Plataforma visual para visitantes con historia, cultura, gastronomía, naturaleza y comercio local.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <CategoryChip value="" active={!category} label="Todo" />
              <CategoryChip value="historia" active={category === "historia"} label="Historia" />
              <CategoryChip value="cultura" active={category === "cultura"} label="Cultura" />
              <CategoryChip value="gastronomia" active={category === "gastronomia"} label="Gastronomía" />
              <CategoryChip value="naturaleza" active={category === "naturaleza"} label="Naturaleza" />
              <CategoryChip value="negocios" active={category === "negocios"} label="Negocios" />
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {spots.map((spot) => (
                <article key={spot.id} className="overflow-hidden rounded-xl border border-border/40 bg-card">
                  <img src={spot.imageUrl} alt={spot.name} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{spot.category}</p>
                    <h2 className="font-serif text-xl text-foreground mt-1">{spot.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{spot.summary}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{spot.address}</p>
                    <p className="text-xs text-muted-foreground">{spot.schedule}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Página {safePage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Link href={safePage > 1 ? buildHref(safePage - 1) : "#"} className="rounded-md border px-3 py-1.5 text-sm">
                  Anterior
                </Link>
                <Link
                  href={safePage < totalPages ? buildHref(safePage + 1) : "#"}
                  className="rounded-md border px-3 py-1.5 text-sm"
                >
                  Siguiente
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="border border-border/40 bg-card p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">Estado urbano</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Flujo turístico estimado: Alto (Centro Histórico)</li>
                <li>• Clima operativo: Nublado, 13°C</li>
                <li>• Movilidad: Tráfico moderado en acceso principal</li>
              </ul>
            </section>
            <TourismAIAssistant />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function CategoryChip({ value, active, label }: { value: string; active: boolean; label: string }) {
  return (
    <Link
      href={value ? `/turismo?category=${value}` : "/turismo"}
      className={`rounded-full border px-3 py-1 text-xs ${active ? "border-accent text-accent" : "border-border text-muted-foreground"}`}
    >
      {label}
    </Link>
  )
}
