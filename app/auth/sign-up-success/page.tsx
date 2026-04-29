import { Suspense } from "react"
import SignUpSuccessClient from "./sign-up-success-client"

export default function SignUpSuccessPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background flex items-center justify-center">Cargando…</main>}>
      <SignUpSuccessClient />
    </Suspense>
  )
}
