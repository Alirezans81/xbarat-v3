import { currencyRepository } from "../repositories/currency.repo";

export const currencyService = {
  create: currencyRepository.create,

  getAll: currencyRepository.getAll,

  getById: currencyRepository.findById,

  updateById: currencyRepository.updateById,

  deleteById: currencyRepository.deleteById,
};
