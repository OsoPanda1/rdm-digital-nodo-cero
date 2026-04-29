import { db } from "@/lib/db"

export async function POST(req: Request) {
  const dbAny = db as any
  const body = (await req.json()) as {
    userId?: string
    lat?: number
    lng?: number
    source?: string
    timestamp?: string
  }
  if (!body.userId || typeof body.lat !== "number" || typeof body.lng !== "number") {
    return Response.json({ error: "Telemetry payload inválido." }, { status: 400 })
  }

  if (!dbAny.locationRecord) {
    return Response.json({ error: "LocationRecord no está habilitado en el schema actual." }, { status: 501 })
  }
  const saved = await dbAny.locationRecord.create({
    data: {
      userId: body.userId,
      lat: body.lat,
      lng: body.lng,
      source: body.source ?? "gps",
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
    },
  })
  return Response.json(saved, { status: 201 })
}
