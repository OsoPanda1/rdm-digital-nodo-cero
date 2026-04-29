import { db } from "@/lib/db"

export async function GET() {
  const dbAny = db as any
  const latest = dbAny.locationRecord
    ? await dbAny.locationRecord.findMany({
        orderBy: { timestamp: "desc" },
        take: 50,
      })
    : []

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ points: latest })}\n\n`))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
