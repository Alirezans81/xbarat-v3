import { prisma } from "../../prisma";
import {
  CreateExchange,
  GetExchangesFilters,
  UpdateExchange,
} from "@/types/back/wallet/exchange";

export const exchangeRepository = {
  create: async (data: CreateExchange) => {
    return prisma.exchange.create({
      data,
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

  getLast: async (filters?: GetExchangesFilters) => {
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
    return prisma.exchange.update({
      where: { id },
      data: newValue,
    });
  },

  deleteById: async (id: string) => {
    return prisma.exchange.delete({ where: { id } });
  },
};
