import { Currency } from "@/generated/prisma";
import { currencyRepository } from "../repositories/currency.repo";

export const currencyService = {
  getAll: currencyRepository.getAll,

  create: currencyRepository.create,

  getById: (id: string) => {
    return currencyRepository.findById(id);
  },

  updateById: (
    id: string,
    newValue: {
      name: string;
      code: string;
      symbol: string;
      decimals: number;
      paymentChannelIds: string[];
    }
  ): Promise<Currency> => {
    return currencyRepository.updateById(id, newValue);
  },

  deleteById: (id: string) => {
    return currencyRepository.deleteById(id);
  },
};
