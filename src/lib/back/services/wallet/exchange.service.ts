import { exchangeRepository } from "../../repositories/wallet/exchange.repo";

export const exchangeService = {
  create: exchangeRepository.create,

  getAll: exchangeRepository.getAll,

  getLast: exchangeRepository.getLast,

  getById: exchangeRepository.findById,

  updateById: exchangeRepository.updateById,

  deleteById: exchangeRepository.deleteById,

  userOwnsTheExchange: async (userId: string, exchangeId: string) => {
    try {
      const foundExchange = await exchangeService.getById(exchangeId);

      if (!foundExchange) return false;

      if (foundExchange.userId === userId) return true;
      return false;
    } catch (error) {
      console.error("[USER_OWNS_EXCHANGE]", error);
    }
  },
};
