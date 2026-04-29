"use client"

import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const register = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setMessage("Registro creado en el SOT ✅")
      setEmail("")
      return
    }

    const data = await res.json()
    setMessage(data.error ?? "No se pudo registrar")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.25),transparent_32%),radial-gradient(circle_at_60%_80%,rgba(34,197,94,0.2),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 [background:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_85%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-14">
        <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <p className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Nodo Cero · SOT Activo
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
              RDM DIGITAL
              <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                Sistema Operativo Territorial
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              Infraestructura cívica en tiempo real: identidad, economía, pagos, geointeligencia e IA contextual
              convergen en una única experiencia territorial antifrágil.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Kpi label="Módulos activos" value="27" />
              <Kpi label="APIs vivas" value="18" />
              <Kpi label="Cobertura territorial" value="RDM + Hidalgo" />
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/40 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300 mb-2">Visor operativo</p>
              <p className="text-sm text-slate-300">
                Turismo inteligente, cartografía viva, identidad ID‑NVIDA, flujos de comercio y protocolos de auditoría
                EOCT/MSR integrados en una sola interfaz.
              </p>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
            <h2 className="mb-2 text-xl font-semibold">ID-NVIDA · acceso ciudadano</h2>
            <p className="mb-5 text-sm text-slate-300">
              Si ya tienes cuenta, entra directo al panel. Si no, crea tu perfil y valida tu identidad digital.
            </p>
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <Link
                href="/auth/login"
                className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-xl border border-violet-300/30 bg-violet-400/10 px-4 py-3 text-center text-sm font-semibold text-violet-200 transition hover:bg-violet-400/20"
              >
                Crear cuenta
              </Link>
            </div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Modo rápido (beta)</p>
            <div className="space-y-3">
              <input
                className="w-full rounded-xl border border-white/15 bg-slate-900/80 p-3 text-sm outline-none ring-cyan-300/30 transition focus:ring"
                type="email"
                value={email}
                placeholder="correo@dominio.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95"
                onClick={register}
              >
                Registro exprés
              </button>
            </div>
            {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}
          </aside>
        </div>
      </section>
    </main>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-lg font-semibold text-cyan-200">{value}</p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
    </div>
  )
}
