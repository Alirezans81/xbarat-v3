import { prisma } from "../prisma";

export const walletRepository = {
  getAll: async () => {
    return prisma.wallet.findMany();
  },

  findByUserId: async (userId: string) => {
    return prisma.wallet.findMany({
      where: { userId },
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
    });
  },
};
