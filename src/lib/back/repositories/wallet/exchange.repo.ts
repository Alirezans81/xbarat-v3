import { prisma } from "../../prisma";
import { Prisma } from "@/generated/prisma";
import {
  CreateExchange,
  GetExchangesFilters,
  UpdateExchange,
  AggregatedExchange,
} from "@/types/back/wallet/exchange";

type FundingSource = "WALLET" | "LIQUIDITY_POOL";

const getFundingSource = async (
  tx: Prisma.TransactionClient,
  userId: string,
  preferred?: FundingSource
): Promise<FundingSource> => {
  if (preferred) return preferred;

  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "PROVIDER" ? "LIQUIDITY_POOL" : "WALLET";
};

const reserveFromWallet = async (
  tx: Prisma.TransactionClient,
  userId: string,
  currencyId: string,
  fromAmount: number,
  fee: number
) => {
  const wallet = await tx.wallet.findUnique({
    where: {
      userId_currencyId: {
        userId,
        currencyId,
      },
    },
    select: {
      balance: true,
      frozen: true,
    },
  });

  if (!wallet) {
    throw new Error("walletNotFound");
  }

  const requiredTotal = +fromAmount + +fee;
  if (+wallet.balance < requiredTotal) {
    throw new Error("insufficientBalance");
  }

  await tx.wallet.update({
    where: {
      userId_currencyId: {
        userId,
        currencyId,
      },
    },
    data: {
      balance: +wallet.balance - requiredTotal,
      frozen: +wallet.frozen + +fromAmount,
    },
  });
};

const reserveFromLiquidityPools = async (
  tx: Prisma.TransactionClient,
  userId: string,
  currencyId: string,
  fromAmount: number,
  fee: number
) => {
  const pools = await tx.liquidityPool.findMany({
    where: { userId, currencyId },
    select: { id: true, balance: true },
    orderBy: [{ updatedAt: "asc" }, { id: "asc" }],
  });

  if (pools.length === 0) {
    throw new Error("liquidityPoolNotFound");
  }

  const requiredTotal = +fromAmount + +fee;
  const totalAvailable = pools.reduce((sum, pool) => sum + +pool.balance, 0);
  if (totalAvailable < requiredTotal) {
    throw new Error("insufficientBalance");
  }

  let remainingTotal = requiredTotal;
  let remainingFrozen = +fromAmount;

  for (const pool of pools) {
    if (remainingTotal <= 0) break;

    const decrementAmount = Math.min(+pool.balance, remainingTotal);
    if (decrementAmount <= 0) continue;

    const frozenIncrement = Math.min(remainingFrozen, decrementAmount);

    await tx.liquidityPool.update({
      where: { id: pool.id },
      data: {
        balance: +pool.balance - decrementAmount,
        frozen: {
          increment: frozenIncrement,
        },
      },
    });

    remainingTotal -= decrementAmount;
    remainingFrozen -= frozenIncrement;
  }
};

const decrementFrozenFromWallet = async (
  tx: Prisma.TransactionClient,
  userId: string,
  currencyId: string,
  amount: number
) => {
  const wallet = await tx.wallet.findUnique({
    where: {
      userId_currencyId: {
        userId,
        currencyId,
      },
    },
    select: { frozen: true },
  });

  await tx.wallet.update({
    where: {
      userId_currencyId: {
        userId,
        currencyId,
      },
    },
    data: {
      frozen: Math.max(0, +(wallet?.frozen ?? 0) - amount),
    },
  });
};

const decrementFrozenFromLiquidityPools = async (
  tx: Prisma.TransactionClient,
  userId: string,
  currencyId: string,
  amount: number,
  refundToBalance: boolean
) => {
  const pools = await tx.liquidityPool.findMany({
    where: { userId, currencyId, frozen: { gt: 0 } },
    select: { id: true, frozen: true },
    orderBy: [{ updatedAt: "asc" }, { id: "asc" }],
  });

  let remaining = amount;
  for (const pool of pools) {
    if (remaining <= 0) break;

    const released = Math.min(+pool.frozen, remaining);
    if (released <= 0) continue;

    await tx.liquidityPool.update({
      where: { id: pool.id },
      data: {
        frozen: +pool.frozen - released,
        ...(refundToBalance
          ? {
              balance: {
                increment: released,
              },
            }
          : {}),
      },
    });

    remaining -= released;
  }
};

const refundFeeToLiquidityPool = async (
  tx: Prisma.TransactionClient,
  userId: string,
  currencyId: string,
  fee: number
) => {
  if (fee <= 0) return;

  const firstPool = await tx.liquidityPool.findFirst({
    where: { userId, currencyId },
    select: { id: true },
    orderBy: [{ updatedAt: "asc" }, { id: "asc" }],
  });

  if (!firstPool) {
    throw new Error("liquidityPoolNotFound");
  }

  await tx.liquidityPool.update({
    where: { id: firstPool.id },
    data: {
      balance: {
        increment: fee,
      },
    },
  });
};

export const exchangeRepository = {
  create: async (data: CreateExchange) => {
    return prisma.$transaction(async (tx) => {
      const { fundingSource: incomingFundingSource, ...exchangeData } = data;
      const currencyPair = await tx.currencyPair.findUnique({
        where: { id: exchangeData.currencyPairId },
        select: {
          fromCurrencyId: true,
        },
      });

      if (!currencyPair) {
        throw new Error("currencyPairNotFound");
      }

      const fundingSource = await getFundingSource(
        tx,
        exchangeData.userId,
        incomingFundingSource
      );

      if (fundingSource === "LIQUIDITY_POOL") {
        await reserveFromLiquidityPools(
          tx,
          exchangeData.userId,
          currencyPair.fromCurrencyId,
          +exchangeData.fromAmount,
          +(exchangeData.fee ?? 0)
        );
      } else {
        await reserveFromWallet(
          tx,
          exchangeData.userId,
          currencyPair.fromCurrencyId,
          +exchangeData.fromAmount,
          +(exchangeData.fee ?? 0)
        );
      }

      return tx.exchange.create({
        data: {
          ...exchangeData,
          remainingAmount:
            exchangeData.remainingAmount && +exchangeData.remainingAmount > 0
              ? exchangeData.remainingAmount
              : exchangeData.fromAmount,
        },
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
          currencyPair: {
            select: {
              fromCurrency: {
                select: {
                  id: true,
                  code: true,
                  symbol: true,
                },
              },
              toCurrency: {
                select: {
                  id: true,
                  code: true,
                  symbol: true,
                },
              },
              isInverseRate: true,
            },
          },
        },
      });
    });
  },

  getLast: async (
    filters?: GetExchangesFilters,
  ): Promise<AggregatedExchange[]> => {
    const groupedExchanges = await prisma.exchange.groupBy({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.currencyPairId && {
          currencyPairId: filters.currencyPairId,
        }),
        ...(filters?.status && {
          status: {
            in: filters.status,
          },
        }),
      },
      by: ["exchangeRate", "currencyPairId"],
      _count: {
        _all: true,
      },
      _sum: {
        fromAmount: true,
        toAmount: true,
      },
      _max: {
        createdAt: true,
      },
      orderBy: {
        _max: {
          createdAt: "desc",
        },
      },
      take: 5,
    });

    const currencyPairIds = groupedExchanges.map((g) => g.currencyPairId);
    const currencyPairs = await prisma.currencyPair.findMany({
      where: {
        id: { in: currencyPairIds },
      },
      select: {
        id: true,
        fromCurrency: {
          select: {
            id: true,
            code: true,
            symbol: true,
          },
        },
        toCurrency: {
          select: {
            id: true,
            code: true,
            symbol: true,
          },
        },
        isInverseRate: true,
      },
    });

    return groupedExchanges.map((group) => ({
      exchangeRate: group.exchangeRate,
      count: group._count._all,
      fromAmount: group._sum.fromAmount || 0,
      latestCreatedAt: group._max.createdAt,
      currencyPair: currencyPairs.find((cp) => cp.id === group.currencyPairId),
    }));
  },

  getAll: async (filters?: GetExchangesFilters) => {
    return prisma.exchange.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.currencyPairId && {
          currencyPairId: filters.currencyPairId,
        }),
        ...(filters?.status && {
          status: {
            in: filters.status,
          },
        }),
      },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
        currencyPair: {
          select: {
            fromCurrency: {
              select: {
                id: true,
                code: true,
                symbol: true,
              },
            },
            toCurrency: {
              select: {
                id: true,
                code: true,
                symbol: true,
              },
            },
            isInverseRate: true,
          },
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.exchange.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
        currencyPair: {
          select: {
            fromCurrency: {
              select: {
                id: true,
                code: true,
                symbol: true,
              },
            },
            toCurrency: {
              select: {
                id: true,
                code: true,
                symbol: true,
              },
            },
            isInverseRate: true,
          },
        },
      },
    });
  },

  updateById: async (id: string, newValue: UpdateExchange) => {
    return prisma.$transaction(async (tx) => {
      const previous = await tx.exchange.findUnique({
        where: { id },
        include: {
          currencyPair: {
            select: {
              fromCurrencyId: true,
              toCurrencyId: true,
              isInverseRate: true,
            },
          },
        },
      });

      if (!previous) {
        throw new Error("exchangeNotFound");
      }

      const updated = await tx.exchange.update({
        where: { id },
        data: newValue,
      });

      const fromCurrencyId = previous.currencyPair.fromCurrencyId;
      const toCurrencyId = previous.currencyPair.toCurrencyId;
      const fundingSource = await getFundingSource(tx, updated.userId);

      const remainingDelta =
        +previous.remainingAmount - +updated.remainingAmount;

      if (remainingDelta > 0) {
        if (fundingSource === "LIQUIDITY_POOL") {
          await decrementFrozenFromLiquidityPools(
            tx,
            updated.userId,
            fromCurrencyId,
            remainingDelta,
            false
          );
        } else {
          await decrementFrozenFromWallet(
            tx,
            updated.userId,
            fromCurrencyId,
            remainingDelta
          );
        }

        const creditAmount = previous.currencyPair.isInverseRate
          ? remainingDelta / +updated.exchangeRate
          : remainingDelta * +updated.exchangeRate;

        await tx.wallet.update({
          where: {
            userId_currencyId: {
              userId: updated.userId,
              currencyId: toCurrencyId,
            },
          },
          data: {
            balance: {
              increment: creditAmount,
            },
          },
        });
      }

      if (updated.status === "COMPLETED" && previous.status !== "COMPLETED") {
        if (fundingSource === "LIQUIDITY_POOL") {
          await decrementFrozenFromLiquidityPools(
            tx,
            updated.userId,
            fromCurrencyId,
            +updated.remainingAmount,
            false
          );
        } else {
          await decrementFrozenFromWallet(
            tx,
            updated.userId,
            fromCurrencyId,
            +updated.remainingAmount
          );
        }

        if (+updated.fee > 0) {
          const feeUser = await tx.feeUser.findFirst({
            where: { isActive: true },
            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            select: { userId: true },
          });

          if (feeUser) {
            await tx.wallet.update({
              where: {
                userId_currencyId: {
                  userId: feeUser.userId,
                  currencyId: fromCurrencyId,
                },
              },
              data: {
                balance: {
                  increment: updated.fee,
                },
              },
            });
          }
        }
      }

      if (
        ["FAILED", "CANCELED"].includes(updated.status) &&
        !["FAILED", "CANCELED"].includes(previous.status)
      ) {
        if (fundingSource === "LIQUIDITY_POOL") {
          await decrementFrozenFromLiquidityPools(
            tx,
            updated.userId,
            fromCurrencyId,
            +updated.remainingAmount,
            true
          );
          await refundFeeToLiquidityPool(
            tx,
            updated.userId,
            fromCurrencyId,
            +updated.fee
          );
        } else {
          const fromWallet = await tx.wallet.findUnique({
            where: {
              userId_currencyId: {
                userId: updated.userId,
                currencyId: fromCurrencyId,
              },
            },
            select: { frozen: true },
          });

          await tx.wallet.update({
            where: {
              userId_currencyId: {
                userId: updated.userId,
                currencyId: fromCurrencyId,
              },
            },
            data: {
              balance: {
                increment: +updated.remainingAmount + +updated.fee,
              },
              frozen: Math.max(
                0,
                +(fromWallet?.frozen ?? 0) - +updated.remainingAmount
              ),
            },
          });
        }
      }

      return updated;
    });
  },

  deleteById: async (id: string) => {
    return prisma.exchange.delete({ where: { id } });
  },
};
