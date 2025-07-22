import { Withdrawal } from "@/generated/prisma";
import { prisma } from "../../prisma";
import {
  CreateWithdrawal,
  GetWithdrawalsFilters,
  UpdateWithdrawal,
} from "@/types/wallet/withdrawal";

export const withdrawalRepository = {
  create: async (data: CreateWithdrawal) => {
    return prisma.withdrawal.create({
      data,
    });
  },

  getAll: async (filters?: GetWithdrawalsFilters) => {
    return prisma.withdrawal.findMany({
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
    return prisma.withdrawal.findUnique({ where: { id } });
  },

  updateById: async (
    id: string,
    newValue: UpdateWithdrawal
  ): Promise<Withdrawal> => {
    return prisma.withdrawal.update({
      where: { id },
      data: newValue,
    });
  },

  deleteById: async (id: string) => {
    return prisma.withdrawal.delete({ where: { id } });
  },
};
