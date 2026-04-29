"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") ?? "/panel"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            ← RDM Digital · Nodo Cero
          </Link>
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-2 text-balance">Acceso al Panel Federado</h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Sólo ciudadanos, comercios e instituciones registradas en el Real del Monte Digital.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ciudadano@rdm.mx"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-destructive font-mono">{error}</p> : null}
          <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {loading ? "Verificando…" : "Entrar al Nodo"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-6">
          ¿Sin acceso?{" "}
          <Link href="/auth/sign-up" className="text-accent underline-offset-4 hover:underline">
            Solicitar ciudadanía digital
          </Link>
        </p>
      </div>
    </main>
  )
}
