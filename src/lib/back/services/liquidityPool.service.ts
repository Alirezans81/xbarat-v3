import { liquidityPoolRepository } from "../repositories/liquidityPool.repo";

export const liquidityPoolService = {
  getAll: liquidityPoolRepository.getAll,

  create: liquidityPoolRepository.create,

  getById: liquidityPoolRepository.findById,

  updateById: liquidityPoolRepository.updateById,

  deleteById: liquidityPoolRepository.deleteById,

  deleteOwnedById: async (id: string, userId: string) => {
    try {
      const liquidityPool = await liquidityPoolService.getById(id);
      if (!liquidityPool) return new Error("notFound");

      if (liquidityPool.userId !== userId) {
        throw new Error("unauthorized");
      }

      return liquidityPoolRepository.deleteById(id);
    } catch (error) {
      throw new Error("unauthorized");
    }
  },
};
