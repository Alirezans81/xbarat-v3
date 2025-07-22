import { currencyPairRepository } from "../repositories/currencyPair.repo";

export const currencyPairService = {
  create: currencyPairRepository.create,

  getAll: currencyPairRepository.getAll,

  getById: currencyPairRepository.findById,

  updateById: currencyPairRepository.updateById,

  deleteById: currencyPairRepository.deleteById,
};
