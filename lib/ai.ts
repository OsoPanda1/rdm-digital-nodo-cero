import { db } from "@/lib/db";

export async function askAI(message: string) {
  const places = await db.place.findMany({ take: 5 });
  const names = places.map((place) => place.name).join(", ");

  return `Consulta: ${message}\nLugares: ${names || "sin datos disponibles"}`;
}
