import { Currency } from "@/generated/prisma";
import { prisma } from "../prisma";

export const currencyRepository = {
  getAll: async () => {
    return prisma.currency.findMany({
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

  create: async (data: {
    code: string;
    name: string;
    symbol: string;
    decimals?: number;
    paymentChannelIds: string[];
  }) => {
    const { code, name, symbol, decimals, paymentChannelIds } = data;

    return await prisma.currency.create({
      data: {
        code,
        name,
        symbol,
        decimals,
        paymentChannels: {
          connect: paymentChannelIds.map((id) => ({ id })),
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.currency.findUnique({
      where: { id },
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

  updateById: async (
    id: string,
    newValue: {
      name: string;
      code: string;
      symbol: string;
      decimals: number;
      paymentChannelIds: string[];
    }
  ): Promise<Currency> => {
    const { code, name, symbol, decimals, paymentChannelIds } = newValue;

    return prisma.currency.update({
      where: { id },
      data: {
        code,
        name,
        symbol,
        decimals,
        paymentChannels: {
          connect: paymentChannelIds.map((id) => ({ id })),
        },
      },
    });
  },

  deleteById: async (id: string) => {
    return prisma.currency.delete({ where: { id } });
  },
};
