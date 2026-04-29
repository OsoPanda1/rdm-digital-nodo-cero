export async function POST(req: Request) {
  const body = await req.text();

  const event = JSON.parse(body);

  if (event.type === "payment_intent.succeeded") {
    console.log("Pago exitoso", event.data?.object?.id);
  }

  return new Response("ok");
}
