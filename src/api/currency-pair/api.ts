import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import {
  CreateCurrencyPair,
  CurrencyPair,
  UpdateCurrencyPair,
  WatchList,
} from "@/types/front/currencyPair";
import { Token } from "@/types/front/globals";

const api = routes();

export const getCurrencyPairs = () => {
  return apiFetch<CurrencyPair[]>(api["currency-pair"]);
};

export const createCurrencyPair = (
  token: Token,
  currencyPair: CreateCurrencyPair
) => {
  return apiFetch<CurrencyPair>(api["currency-pair"], {
    method: "POST",
    body: currencyPair,
    token,
  });
};

export const updateCurrencyPair = (
  token: Token,
  currencyPair_id: string,
  currencyPair: UpdateCurrencyPair
) => {
  return apiFetch<CurrencyPair>(api["currency-pair"] + "/" + currencyPair_id, {
    method: "PUT",
    body: currencyPair,
    token,
  });
};

export const deleteCurrencyPair = (token: Token, currencyPair_id: string) => {
  return apiFetch<null>(api["currency-pair"] + "/" + currencyPair_id, {
    method: "DELETE",
    token,
  });
};

export const getWatchList = () => {
  return apiFetch<WatchList[]>(api["watchlist"]);
};
