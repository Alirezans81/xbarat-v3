import { Deposit } from "@/generated/prisma";
import { prisma } from "../../prisma";
import {
  CreateDeposit,
  GetDepositsFilters,
  UpdateDeposit,
} from "@/types/front/wallet/deposit";

export const depositRepository = {
  create: async (data: CreateDeposit) => {
    return prisma.deposit.create({
      data,
    });
  },

  getAll: async (filters?: GetDepositsFilters) => {
    return prisma.deposit.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.paymentChannelId && {
          paymentChannelId: filters.paymentChannelId,
        }),
        ...(filters?.currencyId && {
          wallet: { currencyId: filters.currencyId },
        }),
        ...(filters?.status && {
          status: filters.status,
        }),
      },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
        wallet: {
          include: {
            currency: {
              select: {
                code: true,
                symbol: true,
                paymentChannels: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        paymentChannel: {
          select: {
            name: true,
          },
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.deposit.findUnique({ where: { id } });
  },

  updateById: async (id: string, newValue: UpdateDeposit) => {
    return prisma.deposit.update({
      where: { id },
      data: newValue,
    });
  },

  deleteById: async (id: string) => {
    return prisma.deposit.delete({ where: { id } });
  },
};
