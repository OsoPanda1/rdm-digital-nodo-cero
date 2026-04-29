import { askAI } from "@/lib/ai"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const dbAny = db as any
  const body = (await req.json()) as { message?: string; mode?: string }
  if (!body.message) return Response.json({ error: "message es requerido" }, { status: 400 })

  const twins = dbAny.digitalTwin
    ? await dbAny.digitalTwin.findMany({
        where: { status: "ACTIVE" },
        take: 12,
        select: { id: true, name: true, narrative: true, lat: true, lng: true, type: true },
      })
    : []
  const context = `Modo: ${body.mode ?? "AUTO"}\nGemelos activos: ${twins.map((t: { name: string }) => t.name).join(", ")}`
  const reply = await askAI(`${body.message}\n${context}`)
  return Response.json({ reply, twins })
}
