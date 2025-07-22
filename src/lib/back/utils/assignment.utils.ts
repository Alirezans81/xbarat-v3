import {
  BridgeTransfer,
  Deposit,
  Withdrawal,
  LiquidityPool,
  Prisma,
} from "@/generated/prisma";

export const assignBridgeTransfers = (
  deposits: Pick<Deposit, "id" | "amount">[],
  withdrawals: Pick<Withdrawal, "id" | "amount">[],
  liquidityPools: Pick<LiquidityPool, "id" | "balance">[]
) => {
  const bridgeTransfers: Pick<
    BridgeTransfer,
    "depositId" | "withdrawalId" | "liquidityPoolId" | "status" | "amount"
  >[] = [];

  const availableDeposits = [...deposits].map((d) => ({
    ...d,
    amount: new Prisma.Decimal(d.amount),
  }));

  const availablePools = [...liquidityPools].map((p) => ({
    ...p,
    balance: new Prisma.Decimal(p.balance),
  }));

  // 1. Try to match withdrawals using deposits first
  for (const withdrawal of withdrawals) {
    let remaining = new Prisma.Decimal(withdrawal.amount);

    // Use deposits
    for (let i = 0; i < availableDeposits.length && remaining.gt(0); i++) {
      const deposit = availableDeposits[i];
      if (deposit.amount.lte(0)) continue;

      const transferAmount = Prisma.Decimal.min(deposit.amount, remaining);

      bridgeTransfers.push({
        depositId: deposit.id,
        withdrawalId: withdrawal.id,
        liquidityPoolId: null,
        status: "PENDING",
        amount: transferAmount,
      });

      deposit.amount = deposit.amount.sub(transferAmount);
      remaining = remaining.sub(transferAmount);
    }

    // If deposits weren't enough, use liquidity pools
    for (let i = 0; i < availablePools.length && remaining.gt(0); i++) {
      const pool = availablePools[i];
      if (pool.balance.lte(0)) continue;

      const transferAmount = Prisma.Decimal.min(pool.balance, remaining);

      bridgeTransfers.push({
        depositId: null,
        withdrawalId: withdrawal.id,
        liquidityPoolId: pool.id,
        status: "PENDING",
        amount: transferAmount,
      });

      pool.balance = pool.balance.sub(transferAmount);
      remaining = remaining.sub(transferAmount);
    }

    // Optional: if still remaining > 0, you may throw error or log it
    if (remaining.gt(0)) throw new Error("Insufficient funds for withdrawal");
  }

  // 2. Assign remaining deposits to liquidity pools
  for (const deposit of availableDeposits) {
    if (deposit.amount.lte(0)) continue;

    const bestPool = availablePools.find((p) => p.balance.gte(0));
    if (!bestPool) break;

    bridgeTransfers.push({
      depositId: deposit.id,
      withdrawalId: null,
      liquidityPoolId: bestPool.id,
      status: "PENDING",
      amount: deposit.amount,
    });

    // Optionally update pool balance (if needed in future steps)
    bestPool.balance = bestPool.balance.add(deposit.amount);

    deposit.amount = new Prisma.Decimal(0);
  }

  return bridgeTransfers;
};
