import { prisma } from "../prisma";
import {
  CreatePaymentChannel,
  GetPaymentChannelsFilters,
  UpdatePaymentChannel,
} from "@/types/front/paymentChannel";

export const paymentChannelRepository = {
  create: async (data: CreatePaymentChannel) => {
    return prisma.paymentChannel.create({
      data,
    });
  },

  getAll: async (filters?: GetPaymentChannelsFilters) => {
    return prisma.paymentChannel.findMany({
      where: {
        ...(filters?.currencyId && {
          currencies: { some: { id: filters.currencyId } },
        }),
      },
    });
  },

  findById: async (id: string) => {
    return prisma.paymentChannel.findUnique({ where: { id } });
  },

  updateById: async (id: string, newValue: UpdatePaymentChannel) => {
    return prisma.paymentChannel.update({
      where: { id },
      data: newValue,
    });
  },

  deleteById: async (id: string) => {
    return prisma.paymentChannel.delete({ where: { id } });
  },
};
