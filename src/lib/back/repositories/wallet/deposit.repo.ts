import { prisma } from "../../prisma";
import {
  CreateDeposit,
  GetDepositsFilters,
  UpdateDeposit,
} from "@/types/back/wallet/deposit";

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
            email: true,
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
    return prisma.$transaction(async (tx) => {
      const previous = await tx.deposit.findUnique({
        where: { id },
      });
      if (!previous) {
        throw new Error("depositNotFound");
      }

      const updated = await tx.deposit.update({
        where: { id },
        data: newValue,
      });

      if (updated.status === "COMPLETED" && previous.status !== "COMPLETED") {
        await tx.wallet.update({
          where: { id: updated.walletId },
          data: {
            balance: {
              increment: updated.amount,
            },
          },
        });

        const bridgeTransfer = await tx.bridgeTransfer.findFirst({
          where: { depositId: updated.id },
          select: { liquidityPoolId: true },
        });

        if (bridgeTransfer?.liquidityPoolId) {
          await tx.liquidityPool.update({
            where: { id: bridgeTransfer.liquidityPoolId },
            data: {
              balance: {
                increment: updated.amount,
              },
            },
          });
        }
      }

      return updated;
    });
  },

  deleteById: async (id: string) => {
    return prisma.deposit.delete({ where: { id } });
  },
};
