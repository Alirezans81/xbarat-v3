import {
  CreateExchangeMatch,
  GetExchangeMatchsFilters,
  UpdateExchangeMatch,
} from "@/types/back/wallet/exchangeMatch";
import { prisma } from "../../prisma";

export const exchangeMatchRepository = {
  create: async (data: CreateExchangeMatch) => {
    return await prisma.exchangeMatch.create({
      data,
    });
  },

  createMany: async (data: CreateExchangeMatch[]) => {
    return await prisma.exchangeMatch.createMany({
      data,
      skipDuplicates: true,
    });
  },

  getAll: async (filters?: GetExchangeMatchsFilters) => {
    return prisma.exchangeMatch.findMany({
      where: {
        ...(filters?.fromExchangeId && {
          fromExchangeId: filters.fromExchangeId,
        }),
        ...(filters?.toExchangeId && { toExchangeId: filters.toExchangeId }),
        ...(filters?.fromMatchedAmountLessThan && {
          fromMatchedAmount: { lt: filters.fromMatchedAmountLessThan },
        }),
        ...(filters?.fromMatchedAmountGreaterThan && {
          fromMatchedAmount: { gt: filters.fromMatchedAmountGreaterThan },
        }),
        ...(filters?.toMatchedAmountLessThan && {
          toMatchedAmount: { lt: filters.toMatchedAmountLessThan },
        }),
        ...(filters?.toMatchedAmountGreaterThan && {
          toMatchedAmount: { gt: filters.toMatchedAmountGreaterThan },
        }),
      },
      include: {
        fromExchange: {
          select: {
            currencyPair: {
              select: {
                fromCurrency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                  },
                },
                toCurrency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
        toExchange: {
          select: {
            currencyPair: {
              select: {
                fromCurrency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                  },
                },
                toCurrency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.exchangeMatch.findUnique({
      where: { id },
      include: {
        fromExchange: {
          select: {
            currencyPair: {
              select: {
                fromCurrency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                  },
                },
                toCurrency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
        toExchange: {
          select: {
            currencyPair: {
              select: {
                fromCurrency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                  },
                },
                toCurrency: {
                  select: {
                    id: true,
                    name: true,
                    symbol: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  },

  updateById: async (id: string, newValue: UpdateExchangeMatch) => {
    return prisma.exchangeMatch.update({
      where: { id },
      data: newValue,
    });
  },

  deleteById: async (id: string) => {
    return prisma.exchangeMatch.delete({ where: { id } });
  },
};
