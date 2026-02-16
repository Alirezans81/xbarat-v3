import { Currency } from "@/generated/prisma";
import { prisma } from "../prisma";
import {
  CreateCurrency,
  GetCurrenciesFilters,
  UpdateCurrency,
} from "@/types/front/currency";
import { randomUUID } from "crypto";

export const currencyRepository = {
  create: async (data: CreateCurrency) => {
    return await prisma.$transaction(async (tx) => {
      const currency = await tx.currency.create({
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

      const users = await tx.user.findMany({
        select: { id: true },
      });

      if (users.length > 0) {
        const now = new Date();
        await tx.wallet.createMany({
          data: users.map((user) => ({
            id: randomUUID(),
            userId: user.id,
            currencyId: currency.id,
            balance: 0,
            frozen: 0,
            createdAt: now,
            updatedAt: now,
          })),
          skipDuplicates: true,
        });
      }

      return currency;
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
