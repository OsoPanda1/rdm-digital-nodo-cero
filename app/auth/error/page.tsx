import Link from "next/link"

export default function AuthError() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-destructive mb-4">Error de auditoría</p>
        <h1 className="font-serif text-3xl text-foreground mb-4">No fue posible verificar tu sesión</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          El protocolo CiteMesh y la Federación Gubernamental rechazaron el intento. Inténtalo nuevamente.
        </p>
        <Link href="/auth/login" className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          ← Reintentar
        </Link>
      </div>
    </main>
  )
}
