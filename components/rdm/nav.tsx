import Link from "next/link"
import { Hexagon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

const links = [
  { href: "/federaciones", label: "Federaciones" },
  { href: "/territorio", label: "Territorio" },
  { href: "/manuscrito", label: "Manuscrito" },
  { href: "/repositorio", label: "Repositorio" },
  { href: "/mercado", label: "Mercado" },
  { href: "/turismo", label: "Turismo" },
]

export async function Nav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Hexagon
              className="h-8 w-8 text-primary transition-transform group-hover:rotate-30"
              strokeWidth={1.25}
              aria-hidden
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-mono font-semibold text-primary">7</span>
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg tracking-wide">RDM Digital</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Nodo · Cero
            </div>
          </div>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/panel"
              className="font-mono text-xs uppercase tracking-[0.2em] px-3 py-1.5 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Panel
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="font-mono text-xs uppercase tracking-[0.2em] px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Acceder
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
