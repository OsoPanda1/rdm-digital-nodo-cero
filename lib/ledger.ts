import { db } from "@/lib/db";

export async function registerReward(userId: string, amount: number) {
  await db.wallet.update({
    where: { userId },
    data: { balance: { increment: amount } },
  });

  return db.transaction.create({
    data: { userId, amount, type: "reward" },
  });
}
