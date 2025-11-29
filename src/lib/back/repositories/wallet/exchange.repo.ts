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

  getLast: async () => {
    return prisma.exchange.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        fromAmount: true,
        toAmount: true,
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
