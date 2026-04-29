import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: "Email es requerido" }, { status: 400 });
  }

  const user = await db.user.create({
    data: {
      email,
      role: "citizen",
      wallet: { create: {} },
    },
  });

  return Response.json(user);
}
