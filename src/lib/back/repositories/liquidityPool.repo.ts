import { prisma } from "../prisma";
import {
  CreateLiquidityPool,
  GetLiquidityPoolsFilters,
  UpdateLiquidityPool,
} from "@/types/front/liquidityPool";

export const liquidityPoolRepository = {
  create: async (data: CreateLiquidityPool) => {
    return prisma.liquidityPool.create({
      data: {
        userId: data.userId,
        currencyId: data.currencyId,
        paymentChannelId: data.paymentChannelId,
        address: data.address,
        balance: data.balance ?? 0,
        frozen: data.frozen ?? 0,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        currency: {
          select: {
            code: true,
            symbol: true,
          },
        },
        paymentChannel: {
          select: {
            name: true,
          },
        },
      },
    });
  },

  getAll: async (filters?: GetLiquidityPoolsFilters) => {
    return prisma.liquidityPool.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.currencyId && { currencyId: filters.currencyId }),
        ...(filters?.paymentChannelId && {
          paymentChannelId: filters.paymentChannelId,
        }),
        ...(filters?.address && { address: { contains: filters.address } }),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        currency: {
          select: {
            id: true,
            code: true,
            symbol: true,
            name: true,
            decimals: true,
          },
        },
        paymentChannel: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  },

  findById: async (
    id: string,
    includeOptions?: {
      user?: boolean;
      currency?: boolean;
      paymentChannel?: boolean;
    }
  ) => {
    return prisma.liquidityPool.findUnique({
      where: { id },
      include: {
        user: includeOptions?.user
          ? {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            }
          : undefined,
        currency: includeOptions?.currency
          ? {
              select: {
                id: true,
                code: true,
                symbol: true,
                name: true,
                decimals: true,
              },
            }
          : undefined,
        paymentChannel: includeOptions?.paymentChannel
          ? {
              select: {
                id: true,
                name: true,
                description: true,
              },
            }
          : undefined,
      },
    });
  },

  updateById: async (id: string, data: UpdateLiquidityPool) => {
    return prisma.liquidityPool.update({
      where: { id },
      data,
      include: {
        currency: {
          select: {
            code: true,
          },
        },
      },
    });
  },

  deleteById: async (id: string) => {
    return prisma.liquidityPool.delete({ where: { id } });
  },

  getTotalLiquidity: async (currencyId?: string) => {
    const where = currencyId ? { currencyId } : {};
    const result = await prisma.liquidityPool.aggregate({
      where,
      _sum: {
        balance: true,
        frozen: true,
      },
    });
    const balance = result._sum.balance
      ? typeof result._sum.balance === "number"
        ? result._sum.balance
        : result._sum.balance.toNumber()
      : 0;
    const frozen = result._sum.frozen
      ? typeof result._sum.frozen === "number"
        ? result._sum.frozen
        : result._sum.frozen.toNumber()
      : 0;
    return {
      totalBalance: balance,
      totalFrozen: frozen,
      totalAvailable: balance + frozen,
    };
  },

  getUserLiquiditySummary: async (userId: string) => {
    const results = await prisma.liquidityPool.groupBy({
      by: ["currencyId"],
      where: { userId },
      _sum: {
        balance: true,
        frozen: true,
      },
    });

    return results.map((result) => ({
      currencyId: result.currencyId,
      balance: result._sum.balance?.toNumber() ?? 0,
      frozen: result._sum.frozen?.toNumber() ?? 0,
      total:
        (result._sum.balance?.toNumber() ?? 0) +
        (result._sum.frozen?.toNumber() ?? 0),
    }));
  },
};
