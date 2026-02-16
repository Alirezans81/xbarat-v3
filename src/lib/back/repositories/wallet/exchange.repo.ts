import { prisma } from "../../prisma";
import {
  CreateExchange,
  GetExchangesFilters,
  UpdateExchange,
  AggregatedExchange,
} from "@/types/back/wallet/exchange";

export const exchangeRepository = {
  create: async (data: CreateExchange) => {
    return prisma.$transaction(async (tx) => {
      const currencyPair = await tx.currencyPair.findUnique({
        where: { id: data.currencyPairId },
        select: {
          fromCurrencyId: true,
        },
      });

      if (!currencyPair) {
        throw new Error("currencyPairNotFound");
      }

      const wallet = await tx.wallet.findUnique({
        where: {
          userId_currencyId: {
            userId: data.userId,
            currencyId: currencyPair.fromCurrencyId,
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

      const requiredTotal = +data.fromAmount + +(data.fee ?? 0);
      if (+wallet.balance < requiredTotal) {
        throw new Error("insufficientBalance");
      }

      await tx.wallet.update({
        where: {
          userId_currencyId: {
            userId: data.userId,
            currencyId: currencyPair.fromCurrencyId,
          },
        },
        data: {
          balance: +wallet.balance - requiredTotal,
          frozen: +wallet.frozen + +data.fromAmount,
        },
      });

      return tx.exchange.create({
        data: {
          ...data,
          remainingAmount:
            data.remainingAmount && +data.remainingAmount > 0
              ? data.remainingAmount
              : data.fromAmount,
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

      const remainingDelta =
        +previous.remainingAmount - +updated.remainingAmount;

      if (remainingDelta > 0) {
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
            frozen: Math.max(0, +(fromWallet?.frozen ?? 0) - remainingDelta),
          },
        });

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
            frozen: Math.max(
              0,
              +(fromWallet?.frozen ?? 0) - +updated.remainingAmount
            ),
          },
        });

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

      return updated;
    });
  },

  deleteById: async (id: string) => {
    return prisma.exchange.delete({ where: { id } });
  },
};
