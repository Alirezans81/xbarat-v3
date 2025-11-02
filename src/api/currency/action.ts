"use server";

import routes from "@/api/routes";
import { Currency } from "@/types/front/currency";
import { apiFetch } from "@/lib/front/utils/apiFetch";

const api = routes();

export const getCurrencies = async () => {
  return await apiFetch<Currency[]>(api["currency"]);
};

export const getCurrencyById = async (id: string): Promise<Currency> => {
  return await apiFetch<Currency>(`${api["currency"]}/${id}`);
};
