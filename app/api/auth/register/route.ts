import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return Response.json({ error: "Email es requerido" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return Response.json(existing);
  }

  const user = await db.user.create({
    data: {
      email: normalizedEmail,
      role: "citizen",
      wallet: { create: {} },
    },
    include: { wallet: true },
  });

  return Response.json(user);
}
