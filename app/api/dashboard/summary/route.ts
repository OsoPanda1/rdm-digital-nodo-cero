import { db } from "@/lib/db";

export async function GET() {
  const [users, commerces, transactions, paymentIntents] = await Promise.all([
    db.user.count(),
    db.commerce.count(),
    db.transaction.count(),
    db.paymentIntent.count(),
  ]);

  const walletAggregate = await db.wallet.aggregate({
    _sum: { balance: true },
  });

  return Response.json({
    users,
    commerces,
    transactions,
    paymentIntents,
    totalWalletBalance: walletAggregate._sum.balance ?? 0,
  });
}
