import { Currency } from "@/generated/prisma";
import { prisma } from "../prisma";
import {
  CreateCurrency,
  GetCurrenciesFilters,
  UpdateCurrency,
} from "@/types/front/currency";

export const currencyRepository = {
  create: async (data: CreateCurrency) => {
    return await prisma.currency.create({
      data: {
        code: data.code,
        name: data.name,
        symbol: data.symbol,
        decimals: data.decimals ?? 2,
        paymentChannels: data.paymentChannelIds
          ? {
              connect: data.paymentChannelIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        paymentChannels: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  getAll: async (filter?: GetCurrenciesFilters) => {
    return prisma.currency.findMany({
      where: {
        ...(filter?.id && { id: filter.id }),
        ...(filter?.code && { code: filter.code }),
        ...(filter?.name && { name: { contains: filter.name } }),
        ...(filter?.symbol && { symbol: filter.symbol }),
        ...(filter?.decimals && { decimals: filter.decimals }),
        ...(filter?.paymentChannelId && {
          paymentChannels: {
            some: { id: filter.paymentChannelId },
          },
        }),
      },
      include: {
        paymentChannels: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  findById: async (id: string, includePaymentChannels: boolean = true) => {
    return prisma.currency.findUnique({
      where: { id },
      include: {
        paymentChannels: includePaymentChannels
          ? {
              select: {
                id: true,
                name: true,
              },
            }
          : undefined,
      },
    });
  },

  updateById: async (id: string, data: UpdateCurrency): Promise<Currency> => {
    const { paymentChannelIds, ...restData } = data;

    return prisma.currency.update({
      where: { id },
      data: {
        ...restData,
        paymentChannels: paymentChannelIds
          ? {
              set: paymentChannelIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        paymentChannels: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  deleteById: async (id: string) => {
    return prisma.currency.delete({ where: { id } });
  },
};
