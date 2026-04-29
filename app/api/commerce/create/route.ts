import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { name, category } = await req.json();

  if (!name || !category) {
    return Response.json({ error: "name y category son requeridos" }, { status: 400 });
  }

  const commerce = await db.commerce.create({
    data: { name, category },
  });

  return Response.json(commerce);
}
