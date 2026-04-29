"use client"

import { Button } from "@/components/ui/button"
import { startCheckout } from "@/app/actions/stripe"
import { useTransition } from "react"
import { Spinner } from "@/components/ui/spinner"

export function CheckoutButton({ productId, label = "Tributar" }: { productId: string; label?: string }) {
  const [pending, start] = useTransition()
  return (
    <form
      action={(fd) => {
        start(() => startCheckout(fd))
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <Button
        type="submit"
        disabled={pending}
        className="bg-accent text-accent-foreground hover:bg-accent/90 w-full rounded-none font-mono text-xs uppercase tracking-[0.2em]"
      >
        {pending ? <Spinner className="mr-2 h-3 w-3" /> : null}
        {pending ? "Conectando…" : label}
      </Button>
    </form>
  )
}
