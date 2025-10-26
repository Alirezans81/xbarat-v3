import { exchangeService } from "../services/wallet/exchange.service";

export const calculateRate = (
  fromExchange: Awaited<ReturnType<typeof exchangeService.getById>>,
  toExchange: Awaited<ReturnType<typeof exchangeService.getById>>
) => {
  if (fromExchange && toExchange) {
    const fromExchangeIsInverseRate = fromExchange.currencyPair.isInverseRate;
    const toExchangeIsInverseRate = toExchange.currencyPair.isInverseRate;

    if (fromExchangeIsInverseRate && !toExchangeIsInverseRate) {
      if (+fromExchange.exchangeRate <= +toExchange.exchangeRate)
        return +fromExchange.exchangeRate;
      else return 0;
    } else if (!fromExchangeIsInverseRate && toExchangeIsInverseRate) {
      if (+fromExchange.exchangeRate >= +toExchange.exchangeRate)
        return +toExchange.exchangeRate;
      else return 0;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

export const calculateMatchedAmount = (
  fromExchange: Awaited<ReturnType<typeof exchangeService.getById>>,
  toExchange: Awaited<ReturnType<typeof exchangeService.getById>>
) => {
  if (fromExchange && toExchange) {
    const fromAmount = !fromExchange.currencyPair.isInverseRate
      ? +fromExchange.remainingAmount
      : +fromExchange.remainingAmount / +fromExchange.exchangeRate;
    const toAmount = !toExchange.currencyPair.isInverseRate
      ? +toExchange.remainingAmount
      : +toExchange.remainingAmount / +toExchange.exchangeRate;

    const fromMatchedAmount = Math.min(fromAmount, toAmount);
    const toMatchedAmount = !fromExchange.currencyPair.isInverseRate
      ? fromMatchedAmount * +fromExchange.exchangeRate
      : fromMatchedAmount / +fromExchange.exchangeRate;

    return { fromMatchedAmount, toMatchedAmount };
  } else {
    return { fromMatchedAmount: 0, toMatchedAmount: 0 };
  }
};
