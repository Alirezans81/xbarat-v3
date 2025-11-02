import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Token } from "@/types/front/globals";
import { Assign } from "@/types/front/wallet/assign";

const api = routes();

export const assign = (token: Token, data: Assign) => {
  return apiFetch(api["assign"], { method: "POST", body: data, token });
};
