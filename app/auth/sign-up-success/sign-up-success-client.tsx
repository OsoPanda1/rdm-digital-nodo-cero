"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export default function SignUpSuccessClient() {
  const params = useSearchParams()
  const email = params.get("email") ?? ""
  const [status, setStatus] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  async function resend() {
    if (!email) return setStatus("No encontramos el correo de registro. Regístrate nuevamente.")
    setSending(true)
    setStatus(null)
    try {
      const supabase = createClient()
      const callbackUrl = new URL("/auth/callback", window.location.origin)
      callbackUrl.searchParams.set("next", "/panel")
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: callbackUrl.toString() },
      })
      setStatus(error ? error.message : "Correo de confirmación reenviado. Revisa spam y promociones.")
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "No se pudo reenviar el correo.")
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">Solicitud registrada</p>
        <h1 className="font-serif text-3xl text-foreground mb-4 text-balance">Confirma tu correo</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Te enviamos un enlace de verificación a <span className="text-foreground">{email || "tu correo"}</span>.
        </p>
        <div className="flex items-center justify-center gap-5">
          <button onClick={resend} disabled={sending} className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {sending ? "Reenviando..." : "Reenviar confirmación"}
          </button>
          <Link href="/auth/login" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Ir al login
          </Link>
        </div>
        {status ? <p className="mt-5 text-sm text-muted-foreground">{status}</p> : null}
      </div>
    </main>
  )
}
