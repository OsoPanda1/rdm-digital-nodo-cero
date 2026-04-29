import { stripe } from "@/lib/stripe"
import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import Link from "next/link"

export default async function ReciboPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  if (!session_id) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <p className="font-mono text-sm text-muted-foreground">Sin sesión válida.</p>
      </main>
    )
  }

  const session = await stripe.checkout.sessions.retrieve(session_id)
  const status = session.status
  const paymentStatus = session.payment_status
  const amount = ((session.amount_total ?? 0) / 100).toFixed(2)

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="max-w-2xl mx-auto px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">
            {paymentStatus === "paid" ? "Tributo confirmado" : "Tributo pendiente"}
          </p>
          <h1 className="font-serif text-4xl text-foreground text-balance mb-6 leading-tight">
            {paymentStatus === "paid"
              ? "Tu aportación quedó registrada en el log EOCT"
              : "Esperando confirmación del banco"}
          </h1>
          <div className="border border-border/60 bg-card p-8 my-10 space-y-3 font-mono text-sm">
            <Row label="Sesión" value={session.id.slice(0, 24) + "…"} />
            <Row label="Estado" value={status ?? "—"} />
            <Row label="Pago" value={paymentStatus} />
            <Row label="Monto" value={`$${amount} ${session.currency?.toUpperCase() ?? "MXN"}`} />
            <Row label="Federación" value={(session.metadata?.federation as string) ?? "—"} />
            <Row label="Producto" value={(session.metadata?.product_id as string) ?? "—"} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Esta transacción se redistribuye automáticamente entre la federación destinataria, la tesorería del Nodo
            Cero y el fondo de manutención del Manuscrito Digital.
          </p>
          <div className="flex gap-4">
            <Link
              href="/panel"
              className="font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline underline-offset-4"
            >
              Ver mi wallet →
            </Link>
            <Link
              href="/mercado"
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              Volver al mercado
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground uppercase text-[10px] tracking-[0.2em]">{label}</span>
      <span className="text-foreground break-all text-right">{value}</span>
    </div>
  )
}
