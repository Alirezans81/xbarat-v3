import { Withdrawal } from "@/generated/prisma";
import { prisma } from "../../prisma";
import {
  CreateWithdrawal,
  GetWithdrawalsFilters,
  UpdateWithdrawal,
} from "@/types/back/wallet/withdrawal";

export const withdrawalRepository = {
  create: async (data: CreateWithdrawal) => {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { id: data.walletId },
        select: { balance: true },
      });

      if (!wallet) {
        throw new Error("walletNotFound");
      }

      if (+wallet.balance < data.amount) {
        throw new Error("insufficientBalance");
      }

      await tx.wallet.update({
        where: { id: data.walletId },
        data: {
          balance: {
            decrement: data.amount,
          },
          frozen: {
            increment: data.amount,
          },
        },
      });

      return tx.withdrawal.create({
        data,
      });
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
        BridgeTransfer: {
          select: {
            id: true,
            status: true,
            documentUrl: true,
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
    return prisma.$transaction(async (tx) => {
      const previous = await tx.withdrawal.findUnique({
        where: { id },
      });
      if (!previous) {
        throw new Error("withdrawalNotFound");
      }

      const updated = await tx.withdrawal.update({
        where: { id },
        data: newValue,
      });

      if (
        updated.status === "COMPLETED" &&
        previous.status !== "COMPLETED"
      ) {
        const wallet = await tx.wallet.findUnique({
          where: { id: updated.walletId },
          select: { frozen: true },
        });

        await tx.wallet.update({
          where: { id: updated.walletId },
          data: {
            frozen: Math.max(0, +(wallet?.frozen ?? 0) - +updated.amount),
          },
        });

        const bridgeTransfer = await tx.bridgeTransfer.findFirst({
          where: { withdrawalId: updated.id },
          select: { liquidityPoolId: true },
        });

        if (bridgeTransfer?.liquidityPoolId) {
          const liquidityPool = await tx.liquidityPool.findUnique({
            where: { id: bridgeTransfer.liquidityPoolId },
            select: { frozen: true },
          });

          await tx.liquidityPool.update({
            where: { id: bridgeTransfer.liquidityPoolId },
            data: {
              frozen: Math.max(
                0,
                +(liquidityPool?.frozen ?? 0) - +updated.amount
              ),
            },
          });
        }
      }

      if (
        ["FAILED", "REJECTED"].includes(updated.status) &&
        !["FAILED", "REJECTED"].includes(previous.status)
      ) {
        const wallet = await tx.wallet.findUnique({
          where: { id: updated.walletId },
          select: { frozen: true },
        });

        await tx.wallet.update({
          where: { id: updated.walletId },
          data: {
            balance: {
              increment: updated.amount,
            },
            frozen: Math.max(0, +(wallet?.frozen ?? 0) - +updated.amount),
          },
        });
      }

      return updated;
    });
  },

  deleteById: async (id: string) => {
    return prisma.$transaction(async (tx) => {
      const deleted = await tx.withdrawal.delete({ where: { id } });

      if (deleted.status !== "COMPLETED") {
        const wallet = await tx.wallet.findUnique({
          where: { id: deleted.walletId },
          select: { frozen: true },
        });

        await tx.wallet.update({
          where: { id: deleted.walletId },
          data: {
            balance: {
              increment: deleted.amount,
            },
            frozen: Math.max(0, +(wallet?.frozen ?? 0) - +deleted.amount),
          },
        });
      }

      return deleted;
    });
  },
};
