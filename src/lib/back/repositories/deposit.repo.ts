import { Deposit } from "@/generated/prisma";
import { prisma } from "../prisma";

export const depositRepository = {
  getAll: async () => {
    return prisma.deposit.findMany({
      include: {
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
      },
    });
  },

  create: async (data: {
    userId: string;
    amount: number;
    walletId: string;
    paymentChannelId: string;
  }) => {
    return prisma.deposit.create({
      data,
    });
  },

  findById: async (id: string) => {
    return prisma.deposit.findUnique({ where: { id } });
  },

  findByUserId: async (userId: string) => {
    return prisma.deposit.findMany({
      where: {
        userId,
      },
      include: {
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
      },
    });
  },

  updateById: async (
    id: string,
    newValue: {
      userId: string;
      amount: number;
      walletId: string;
      paymentChannelId: string;
    }
  ): Promise<Deposit> => {
    return prisma.deposit.update({
      where: { id },
      data: newValue,
    });
  },

  deleteById: async (id: string) => {
    return prisma.deposit.delete({ where: { id } });
  },
};
