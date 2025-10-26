import { currencyPairRepository } from "../repositories/currencyPair.repo";

export const currencyPairService = {
  create: currencyPairRepository.create,

  getAll: currencyPairRepository.getAll,

  getById: currencyPairRepository.findById,

  getByFromCurrencyIdAndToCurrencyId:
    currencyPairRepository.findByFromCurrencyIdAndToCurrencyId,

  getOppositeByCurrencyPair: async (
    data: Awaited<ReturnType<typeof currencyPairRepository.findById>>
  ): Promise<Awaited<
    ReturnType<typeof currencyPairRepository.findById>
  > | null> => {
    if (data) {
      const { fromCurrencyId, toCurrencyId } = data;

      return currencyPairRepository.findByFromCurrencyIdAndToCurrencyId({
        fromCurrencyId: toCurrencyId,
        toCurrencyId: fromCurrencyId,
      });
    } else {
      return new Promise(() => null);
    }
  },

  updateById: currencyPairRepository.updateById,

  deleteById: currencyPairRepository.deleteById,
};
