import { registerReward } from "@/lib/ledger";

export async function POST(req: Request) {
  const { userId, amount } = await req.json();

  if (!userId || typeof amount !== "number") {
    return Response.json({ error: "userId y amount son requeridos" }, { status: 400 });
  }

  await registerReward(userId, amount);

  return Response.json({ success: true });
}
