import { prisma } from "../prisma";
import {
  CreateFeeUser,
  GetFeeUserFilters,
  UpdateFeeUser,
} from "@/types/back/feeUser";

export const feeUserRepository = {
  create: async (data: CreateFeeUser) => {
    return await prisma.feeUser.create({
      data,
    });
  },
  getAll: async (filter?: GetFeeUserFilters) => {
    return prisma.feeUser.findMany({
      where: {
        ...(filter?.userId && { userId: filter.userId }),
        ...(filter?.isActive && { isActive: filter.isActive }),
      },
    });
  },

  setInactiveOthers: async (id: string) => {
    return prisma.feeUser.updateMany({
      where: {
        id: { not: id },
      },
      data: {
        isActive: false,
      },
    });
  },

  setActive: async (id: string) => {
    return prisma.feeUser.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
  },

  deleteById: async (id: string) => {
    return prisma.feeUser.delete({ where: { id } });
  },
};
