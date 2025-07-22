import { GetUsersFilters } from "@/types/front/user";
import { prisma } from "../prisma";

export const userRepository = {
  createUser: async (data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phoneNumber: string;
    countryCode: string;
  }) => {
    return prisma.user.create({ data });
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
};
