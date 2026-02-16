import { GetUsersFilters } from "@/types/front/user";
import { prisma } from "../prisma";
import { UpdateUser } from "@/types/back/user";
import { randomUUID } from "crypto";

export const userRepository = {
  createUser: async (data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phoneNumber: string;
    countryCode: string;
  }) => {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data });

      const currencies = await tx.currency.findMany({
        select: { id: true },
      });

      if (currencies.length > 0) {
        const now = new Date();
        await tx.wallet.createMany({
          data: currencies.map((currency) => ({
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

      return user;
    });
  },

  getAll: async (filters?: GetUsersFilters) => {
    return prisma.user.findMany({
      where: {
        ...(filters?.email && { email: { contains: filters.email } }),
        ...(filters?.fullName && { fullName: { contains: filters.fullName } }),
        ...(filters?.phoneNumber && {
          phoneNumber: filters.phoneNumber,
        }),
        ...(filters?.countryCode && {
          countryCode: filters.countryCode,
        }),
      },
      include: { wallet: true },
    });
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  update: async (
    id: string,
    data: Omit<UpdateUser, "document"> & { documentPhotoUrl?: string }
  ) => {
    return prisma.user.update({ where: { id }, data });
  },
};
