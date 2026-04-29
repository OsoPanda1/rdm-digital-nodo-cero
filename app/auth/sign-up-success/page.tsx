import Link from "next/link"

export default function SignUpSuccess() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">Solicitud registrada</p>
        <h1 className="font-serif text-3xl text-foreground mb-4 text-balance">Confirma tu correo</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Te enviamos un enlace de verificación. Una vez confirmado, tu ciudadanía digital quedará activa en el log
          EOCT del Nodo Cero y podrás entrar al panel federado.
        </p>
        <div className="flex items-center justify-center gap-5">
          <Link href="/auth/login" className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Ir al login
          </Link>
          <Link href="/" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Volver al territorio
          </Link>
        </div>
      </div>
    </main>
  )
}
