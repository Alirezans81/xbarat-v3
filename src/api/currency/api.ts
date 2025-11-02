import { apiFetch } from "@/lib/front/utils/apiFetch";
import routes from "@/api/routes";
import {
  CreateCurrency,
  UpdateCurrency,
  Currency,
} from "@/types/front/currency";
import { Token } from "@/types/front/globals";

const api = routes();

export const getCurrencies = () => apiFetch<Currency[]>(api["currency"]);

export const createCurrency = (token: Token, currency: CreateCurrency) =>
  apiFetch<Currency>(api["currency"], {
    method: "POST",
    body: JSON.stringify(currency),
    token,
  });

export const updateCurrency = (
  token: Token,
  currency_id: string,
  currency: UpdateCurrency
) =>
  apiFetch<Currency>(`${api["currency"]}/${currency_id}`, {
    method: "PUT",
    body: JSON.stringify(currency),
    token,
  });

export const deleteCurrency = (token: Token, currency_id: string) =>
  apiFetch<null>(`${api["currency"]}/${currency_id}`, {
    method: "DELETE",
    token,
  });
