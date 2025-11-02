"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { Exchange } from "@/types/front/wallet/exchange";
import { cookies } from "next/dist/server/request/cookies";

const api = routes();

export const getExchanges = async (): Promise<Exchange[]> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("token");
  const token: Token = cookie
    ? { value: cookie.value, expiration: defaultToken.expiration }
    : defaultToken;

  return apiFetch<Exchange[]>(api["exchange"], {
    method: "GET",
    token,
  });
};
