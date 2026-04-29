import { eventFabric } from "@/core/event/event-fabric";
import { verifyToken } from "@/infra/security/auth";
import { rateLimit } from "@/infra/security/rate-limit";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return new Response("Unauthorized", { status: 401 });

  try {
    verifyToken(token);
    await rateLimit(req.headers.get("x-forwarded-for") || "unknown");
  } catch {
    return new Response("Forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();
  const clientId = crypto.randomUUID();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown, id?: string) => {
        controller.enqueue(
          encoder.encode(`id: ${id || Date.now()}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      send("init", { clientId });
      const unsubscribe = await eventFabric.subscribe("isabella:decision", (payload, id) => {
        send("decision", payload, id);
      });

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`:hb\n\n`));
      }, 15_000);

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unsubscribe?.();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Encoding": "none",
    },
  });
}
