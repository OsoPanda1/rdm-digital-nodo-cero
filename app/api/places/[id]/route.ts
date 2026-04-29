import { db } from "@/lib/db"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const place = await db.place.findUnique({
    where: { id },
    include: { twin: true },
  })
  if (!place) return Response.json({ error: "PLACE_NOT_FOUND" }, { status: 404 })
  return Response.json(place)
}
