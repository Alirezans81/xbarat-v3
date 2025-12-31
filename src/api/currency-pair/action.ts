"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { CurrencyPair, WatchList } from "@/types/front/currencyPair";

const api = routes();

export const getCurrencyPairs = async (): Promise<CurrencyPair[]> => {
  return await apiFetch<CurrencyPair[]>(api["currency-pair"]);
};

export const getCurrencyPairById = async (
  id: string
): Promise<CurrencyPair> => {
  return await apiFetch<CurrencyPair>(api["currency-pair"] + "/" + id);
};