import routes from "@/api/routes";
import { CreateExchange } from "@/types/front/wallet/exchange";
import { Token } from "@/types/front/globals";
import { apiFetch } from "@/lib/front/utils/apiFetch";

const api = routes();

export const createExchange = (token: Token, exchange: CreateExchange) => {
  return apiFetch(api["exchange"], { method: "POST", body: exchange, token });
};
