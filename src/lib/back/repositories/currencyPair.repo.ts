import { CurrencyPair } from "@/generated/prisma";
import { prisma } from "../prisma";
import {
  CreateCurrencyPair,
  GetCurrencyPairsFilters,
  UpdateCurrencyPair,
} from "@/types/front/currencyPair";

export const currencyPairRepository = {
  create: async (data: CreateCurrencyPair) => {
    return await prisma.currencyPair.create({
      data: {
        fromCurrencyId: data.fromCurrencyId,
        toCurrencyId: data.toCurrencyId,
        rate: data.rate,
        isInverseRate: data.isInverseRate,
        isActive: data.isActive,
      },
    });
  },

  getAll: async (filter?: GetCurrencyPairsFilters) => {
    return prisma.currencyPair.findMany({
      include: {
        fromCurrency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true,
          },
        },
        toCurrency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true,
          },
        },
      },
      where: {
        ...(filter?.id && { id: filter.id }),
        ...(filter?.fromCurrencyId && {
          fromCurrencyId: filter.fromCurrencyId,
        }),
        ...(filter?.toCurrencyId && { toCurrencyId: filter.toCurrencyId }),
        ...(filter?.rate && { rate: filter.rate }),
        ...(filter?.isInverseRate && { isInverseRate: filter.isInverseRate }),
        ...(filter?.isActive && { isActive: filter.isActive }),
      },
    });
  },

  findById: async (id: string) => {
    return prisma.currencyPair.findUnique({
      where: { id },
      include: {
        fromCurrency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true,
          },
        },
        toCurrency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true,
          },
        },
      },
    });
  },

  findByFromCurrencyIdAndToCurrencyId: async (data: {
    fromCurrencyId: string;
    toCurrencyId: string;
  }) => {
    const { fromCurrencyId, toCurrencyId } = data;

    return prisma.currencyPair.findUnique({
      where: {
        fromCurrencyId_toCurrencyId: {
          fromCurrencyId,
          toCurrencyId,
        },
      },
      include: {
        fromCurrency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true,
          },
        },
        toCurrency: {
          select: {
            id: true,
            code: true,
            name: true,
            symbol: true,
          },
        },
      },
    });
  },

  updateById: async (
    id: string,
    data: UpdateCurrencyPair
  ): Promise<CurrencyPair> => {
    return prisma.currencyPair.update({
      where: { id },
      data,
    });
  },

  deleteById: async (id: string) => {
    return prisma.currencyPair.delete({ where: { id } });
  },
};
