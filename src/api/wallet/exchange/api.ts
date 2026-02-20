import routes from "@/api/routes";
import { CreateExchange, Exchange, GetExchangesFilters } from "@/types/front/wallet/exchange";
import { Token } from "@/types/front/globals";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Exchange as BackExchange } from "@/types/back/wallet/exchange";

const api = routes();

export const createExchange = (token: Token, exchange: CreateExchange) => {
  return apiFetch(api["exchange"], { method: "POST", body: exchange, token });
};

export const getExchanges = (token: Token, filters?: GetExchangesFilters) => {
  return apiFetch<Exchange[]>(api["exchange"], {
    method: "GET",
    params: filters,
    token,
  });
};

export const getLastExchanges = (currencyPairId: string) => {
  return apiFetch<(BackExchange & { count: number })[]>(
    api["order-book"] + "/" + currencyPairId,
    {
      method: "GET",
    }
  );
};
