import { exchangeMatchRepository } from "../../repositories/wallet/exchangeMatch.repo";

export const exchangeMatchService = {
  create: exchangeMatchRepository.create,

  createMany: exchangeMatchRepository.createMany,

  getAll: exchangeMatchRepository.getAll,

  getLastByCurrencyPairId: exchangeMatchRepository.getLastByCurrencyPairId,

  getById: exchangeMatchRepository.findById,

  updateById: exchangeMatchRepository.updateById,

  deleteById: exchangeMatchRepository.deleteById,
};
