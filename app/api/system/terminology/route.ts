import { TAMV_NOMENCLATURE } from "@/lib/tamv/nomenclature"

export async function GET() {
  return Response.json({
    glossaryVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    entries: TAMV_NOMENCLATURE,
  })
}
