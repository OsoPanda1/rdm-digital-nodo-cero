"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function TourismAIAssistant() {
  const [message, setMessage] = useState("¿Qué puedo visitar hoy en Real del Monte en 4 horas?")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  async function ask() {
    setLoading(true)
    const res = await fetch("/api/realito/isabella/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
    const data = await res.json()
    setAnswer(data.reply ?? data.error ?? "Sin respuesta")
    setLoading(false)
  }

  return (
    <section className="border border-border/40 bg-card p-6">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">Asistente IA TAMV</p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-24 w-full rounded-md border border-border bg-background p-3 text-sm"
      />
      <Button className="mt-3" disabled={loading} onClick={ask}>
        {loading ? "Consultando..." : "Preguntar"}
      </Button>
      {answer ? <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">{answer}</p> : null}
    </section>
  )
}
