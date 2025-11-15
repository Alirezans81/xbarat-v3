import { prisma } from "../prisma";
import { FeeUser } from "@/generated/prisma";
import { CreateFeeUser, GetFeeUserFilters } from "@/types/back/feeUser";

export const feeUserRepository = {
  create: async (data: CreateFeeUser) => {
    return await prisma.feeUser.create({
      data: {
        id: data.id,
        userId: data.userId,
        isActive: data.isActive,
      },
    });
  },
  getAll: async (filter?: GetFeeUserFilters) => {
    return prisma.feeUser.findMany({
      where: {
        ...(filter?.id && { id: filter.id }),
        ...(filter?.userId && { userId: filter.userId }),
        ...(filter?.isActive && { isActive: filter.isActive }),
      },
    });
  },
};
