import { createClient } from "@/lib/supabase/server"
import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Footer } from "@/components/rdm/footer"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/rdm/logout-button"

export const metadata = { title: "Panel Federado — RDM Digital" }

export default async function PanelPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const [{ data: profile }, { data: wallet }, { data: txs }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("wallets").select("*").eq("user_id", user.id).single(),
    supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
  ])

  return (
    <>
      <TopBar />
      <Nav />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/40">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">Panel federado</p>
                <h1 className="font-serif text-4xl text-foreground text-balance leading-tight">
                  Hola, {profile?.display_name ?? user.email}
                </h1>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-3">
                  Rol: {profile?.role ?? "ciudadano"} · ID: {user.id.slice(0, 8)}…
                </p>
              </div>
              <LogoutButton />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 border border-border/40">
              <Stat label="Saldo MXN" value={`$${((wallet?.balance_mxn_cents ?? 0) / 100).toFixed(2)}`} />
              <Stat label="Créditos TAMV" value={String(wallet?.balance_tamv_credits ?? 0)} />
              <Stat label="Reputación" value={String(wallet?.reputation ?? 100)} />
              <Stat label="Tributos" value={String((txs ?? []).filter((t) => t.status === "paid").length)} />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-serif text-2xl text-foreground mb-6">Transacciones recientes</h2>
          {(txs ?? []).length === 0 ? (
            <div className="border border-dashed border-border/60 p-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Sin movimientos</p>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Aporta tu primer tributo en el{" "}
                <a href="/mercado" className="text-accent underline-offset-4 hover:underline">
                  mercado federado
                </a>{" "}
                para activar tu wallet TAMV.
              </p>
            </div>
          ) : (
            <div className="border border-border/40 divide-y divide-border/40">
              {(txs ?? []).map((t) => (
                <div key={t.id} className="bg-card p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{t.type}</p>
                    <p className="text-sm text-foreground mt-1">
                      {(t.metadata as any)?.federation ?? "—"} ·{" "}
                      <span className="font-mono text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleString("es-MX")}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg text-foreground">
                      ${(t.amount_cents / 100).toFixed(2)}{" "}
                      <span className="text-xs text-muted-foreground uppercase">{t.currency}</span>
                    </p>
                    <p
                      className={`font-mono text-[10px] uppercase tracking-wider ${
                        t.status === "paid"
                          ? "text-accent"
                          : t.status === "pending"
                            ? "text-muted-foreground"
                            : "text-destructive"
                      }`}
                    >
                      {t.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-6">
      <p className="font-mono text-3xl text-foreground">{value}</p>
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
