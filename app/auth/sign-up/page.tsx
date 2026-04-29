"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [role, setRole] = useState("ciudadano")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    let error: { message: string } | null = null
    try {
      const supabase = createClient()
      const callbackUrl = new URL("/auth/callback", window.location.origin)
      callbackUrl.searchParams.set("next", "/panel")
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl.toString(),
          data: { display_name: displayName, role },
        },
      })
      error = response.error
    } catch (e) {
      error = { message: e instanceof Error ? e.message : "No se pudo inicializar autenticación." }
    }
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(`/auth/sign-up-success?email=${encodeURIComponent(email)}`)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            ← RDM Digital · Nodo Cero
          </Link>
        </div>
        <h1 className="font-serif text-3xl text-foreground mb-2 text-balance">Solicitud de ciudadanía digital</h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Tu inscripción al Real del Monte Digital queda registrada en el log de auditoría EOCT y revisada por la
          Federación Gubernamental.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="display_name">Nombre público</Label>
            <Input id="display_name" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Rol solicitado</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="ciudadano">Ciudadano</option>
              <option value="comercio">Comercio</option>
              <option value="institucion">Institución</option>
            </select>
          </div>
          {error ? <p className="text-sm text-destructive font-mono">{error}</p> : null}
          <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {loading ? "Registrando…" : "Solicitar acceso"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-6">
          ¿Ya tienes acceso?{" "}
          <Link href="/auth/login" className="text-accent underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
