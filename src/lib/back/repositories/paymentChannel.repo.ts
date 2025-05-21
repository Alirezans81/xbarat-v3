import { PaymentChannel } from "@/generated/prisma";
import { prisma } from "../prisma";

export const paymentChannelRepository = {
  getAll: async () => {
    return prisma.paymentChannel.findMany();
  },

  create: async (data: { name: string; description?: string }) => {
    return prisma.paymentChannel.create({
      data,
    });
  },

  findById: async (id: string) => {
    return prisma.paymentChannel.findUnique({ where: { id } });
  },

  updateById: async (
    id: string,
    newValue: {
      name: string;
      description?: string;
    }
  ): Promise<PaymentChannel> => {
    return prisma.paymentChannel.update({
      where: { id },
      data: newValue,
    });
  },

  deleteById: async (id: string) => {
    return prisma.paymentChannel.delete({ where: { id } });
  },
};
