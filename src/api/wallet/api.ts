import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Wallet } from "@/types/back/wallet";
import { Token } from "@/types/front/globals";

const api = routes();

export const getWallets = (token: Token) => {
  return apiFetch<Wallet[]>(api["wallet"], {
    method: "GET",
    token,
  });
};
