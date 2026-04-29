import { db } from "@/lib/db"

export async function POST(req: Request) {
  const body = (await req.json()) as {
    name?: string
    category?: string
    address?: string
    lat?: number
    lng?: number
    narrative?: string
  }

  if (!body.name || !body.category || !body.address || typeof body.lat !== "number" || typeof body.lng !== "number") {
    return Response.json({ error: "Campos incompletos para registrar lugar." }, { status: 400 })
  }

  const twin = await db.digitalTwin.create({
    data: {
      code: `TWIN_${Date.now()}`,
      name: body.name,
      type: "PLACE",
      status: "ACTIVE",
      lat: body.lat,
      lng: body.lng,
      tags: [body.category.toLowerCase()],
      narrative: body.narrative ?? "",
    },
  })

  const place = await db.place.create({
    data: {
      name: body.name,
      type: body.category,
      lat: body.lat,
      lng: body.lng,
      address: body.address,
      twinId: twin.id,
    },
  })

  return Response.json({ place, twin }, { status: 201 })
}
