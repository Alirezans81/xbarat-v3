import { GetWalletsFilters } from "@/types/wallet";
import { prisma } from "../prisma";

export const walletRepository = {
  getAll: async (filters?: GetWalletsFilters) => {
    return prisma.wallet.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.currencyId && { currencyId: filters.currencyId }),
        ...(filters?.paymentChannelId && {
          paymentChannelId: filters.paymentChannelId,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
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
    });
  },
};
