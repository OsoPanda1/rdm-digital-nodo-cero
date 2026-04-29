export async function GET() {
  return Response.json({
    service: "RDM Digital SOT",
    version: "1.0",
    endpoints: [
      "/api/auth/register",
      "/api/economy/reward",
      "/api/commerce/create",
      "/api/ai/ask",
      "/api/payments/create",
      "/api/webhooks/stripe",
      "/api/dashboard/summary",
    ],
  });
}
