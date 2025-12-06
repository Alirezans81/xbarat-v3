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
    return prisma.exchange
      .findMany({
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
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          exchangeRate: true, // Add rate to select for grouping
          fromAmount: true,
          toAmount: true,
          createdAt: true, // Keep for ordering
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
      })
      .then((exchanges) => {
        const grouped = exchanges.reduce((acc, exchange) => {
          const key = exchange.exchangeRate.toString();
          if (!acc[key]) {
            acc[key] = {
              rate: exchange.exchangeRate,
              totalFromAmount: 0,
              count: 0,
              latestCreatedAt: exchange.createdAt,
              currencyPair: exchange.currencyPair,
              exchanges: [],
            };
          }

          acc[key].totalFromAmount += exchange.fromAmount.toNumber();
          acc[key].count += 1;
          if (exchange.createdAt > acc[key].latestCreatedAt) {
            acc[key].latestCreatedAt = exchange.createdAt;
          }
          acc[key].exchanges.push(exchange);

          return acc;
        }, {} as Record<string, any>);

        return Object.values(grouped)
          .sort((a, b) => b.latestCreatedAt - a.latestCreatedAt)
          .slice(0, 5);
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
