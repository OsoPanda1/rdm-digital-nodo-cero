"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()
  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }
  return (
    <Button
      variant="outline"
      onClick={logout}
      className="font-mono text-xs uppercase tracking-[0.2em] bg-transparent"
    >
      Cerrar sesión
    </Button>
  )
}
