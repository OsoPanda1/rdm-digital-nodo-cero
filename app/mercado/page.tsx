import { createClient } from "@/lib/supabase/server"
import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import { CheckoutButton } from "@/components/rdm/checkout-button"
import { TRIBUTES } from "@/lib/products"

export const metadata = {
  title: "Mercado Federado — RDM Digital",
  description: "Pagos reales en MXN. Stripe Connect. Recompensas territoriales.",
}

export default async function MercadoPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*, merchants(business_name, municipality, verified)")
    .eq("active", true)
    .order("created_at", { ascending: false })

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/40">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">V · MERCADO FEDERADO</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground text-balance mb-6 leading-[1.05]">
              Comercio territorial con pagos reales
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Stripe Checkout en MXN, registro de cada transacción en el log EOCT, redistribución hacia las
              federaciones. Cada compra reactiva el territorio.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-serif text-2xl text-foreground mb-2">Tributos federados</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Aportaciones simbólico-económicas que sostienen la infraestructura del Nodo Cero. 100% trazable, registrado
            en Stripe + Supabase.
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-border/40 border border-border/40 mb-16">
            {TRIBUTES.map((t) => (
              <div key={t.id} className="bg-card p-8 flex flex-col">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">{t.federation}</p>
                <h3 className="font-serif text-xl text-foreground mb-2">{t.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{t.description}</p>
                <p className="font-mono text-2xl text-foreground mb-4">
                  ${(t.priceInCents / 100).toFixed(2)} <span className="text-xs text-muted-foreground">MXN</span>
                </p>
                <CheckoutButton productId={t.id} label="Tributar" />
              </div>
            ))}
          </div>

          {(products ?? []).length > 0 ? (
            <>
              <h2 className="font-serif text-2xl text-foreground mb-8">Productos del territorio</h2>
              <div className="grid md:grid-cols-3 gap-px bg-border/40 border border-border/40">
                {(products ?? []).map((p: any) => (
                  <article key={p.id} className="bg-card p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
                      {p.merchants?.business_name ?? "Comercio"} · {p.merchants?.municipality ?? "—"}
                    </p>
                    <h3 className="font-serif text-lg text-foreground mb-2">{p.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[3em]">{p.description}</p>
                    <p className="font-mono text-xl text-foreground">
                      ${(p.price_cents / 100).toFixed(2)}{" "}
                      <span className="text-xs text-muted-foreground uppercase">{p.currency}</span>
                    </p>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="border border-dashed border-border/60 p-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Onboarding de comercios en curso
              </p>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Comercios del Real del Monte, Pachuca y Mineral del Chico, registren su catálogo desde el panel
                federado.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
