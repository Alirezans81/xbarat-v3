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

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },

  getAll: async () => {
    return prisma.user.findMany({ include: { wallet: true } });
  },
};
