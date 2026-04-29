import { ProtocolEngine } from "@/lib/tamv/protocol.engine"
import type { ProtocolCommand } from "@/lib/tamv/protocol.types"

function isProtocolCommand(body: unknown): body is ProtocolCommand {
  if (!body || typeof body !== "object") return false
  const value = body as Record<string, unknown>
  return (
    typeof value.id === "string" &&
    typeof value.actorId === "string" &&
    typeof value.name === "string" &&
    Boolean(value.payload) &&
    typeof value.payload === "object"
  )
}

export async function POST(req: Request) {
  const body: unknown = await req.json()
  if (!isProtocolCommand(body)) {
    return Response.json({ error: "Payload inválido para protocolo." }, { status: 400 })
  }

  const engine = new ProtocolEngine()
  const result = engine.execute(body)
  return Response.json(result, { status: 200 })
}
