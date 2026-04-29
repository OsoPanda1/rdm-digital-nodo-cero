import { db } from "@/lib/db"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const dbAny = db as any
  const { id } = await params
  const place = await dbAny.place.findUnique({
    where: { id },
  })
  if (!place) return Response.json({ error: "PLACE_NOT_FOUND" }, { status: 404 })
  return Response.json(place)
}
