import { prisma } from "../prisma";
import {
  CreateBridgeTransfer,
  GetBridgeTransfersFilters,
  UpdateBridgeTransfer,
} from "@/types/front/bridgeTransfer";

export const bridgeTransferRepository = {
  create: async (data: CreateBridgeTransfer) => {
    return await prisma.bridgeTransfer.create({
      data,
    });
  },

  createMany: async (data: CreateBridgeTransfer[]) => {
    return await prisma.bridgeTransfer.createMany({
      data,
      skipDuplicates: true,
    });
  },

  getAll: async (filters?: GetBridgeTransfersFilters) => {
    return prisma.bridgeTransfer.findMany({
      where: {
        ...(filters?.depositId && { depositId: filters.depositId }),
        ...(filters?.channelId && { channelId: filters.channelId }),
        ...(filters?.withdrawalId && { withdrawalId: filters.withdrawalId }),
        ...(filters?.liquidityPoolId && {
          liquidityPoolId: filters.liquidityPoolId,
        }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        deposit: {
          select: {
            amount: true,
            wallet: {
              select: {
                user: {
                  select: {
                    fullName: true,
                  },
                },
                currency: {
                  select: {
                    code: true,
                    name: true,
                    symbol: true,
                  },
                },
              },
            },
          },
        },
        withdrawal: {
          select: {
            amount: true,
            receiverAddress: true,
            addressOwnerName: true,
            wallet: {
              select: {
                currency: {
                  select: {
                    code: true,
                    name: true,
                    symbol: true,
                  },
                },
              },
            },
          },
        },
        liquidityPool: {
          select: {
            address: true,
          },
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.bridgeTransfer.findUnique({
      where: { id },
    });
  },

  updateById: async (id: string, newValue: UpdateBridgeTransfer) => {
    return prisma.bridgeTransfer.update({
      where: { id },
      data: newValue,
    });
  },

  deleteById: async (id: string) => {
    return prisma.bridgeTransfer.delete({ where: { id } });
  },
};
