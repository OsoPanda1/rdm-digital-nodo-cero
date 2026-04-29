import { askAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return Response.json({ error: "message es requerido" }, { status: 400 });
  }

  const response = await askAI(message);
  return Response.json({ response });
}
