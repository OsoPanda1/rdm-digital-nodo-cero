import { Suspense } from "react"
import Link from "next/link"
import LoginClient from "./login-client"

export default function LoginPage() {
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
        <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando autenticación…</p>}>
          <LoginClient />
        </Suspense>
      </div>
    </main>
  )
}
