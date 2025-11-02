"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { Withdrawal } from "@/types/front/wallet/withdrawal";
import { cookies } from "next/dist/server/request/cookies";

const api = routes();

export const getWithdrawals = async (): Promise<Withdrawal[]> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("token");
  const token: Token = cookie
    ? { value: cookie.value, expiration: defaultToken.expiration }
    : defaultToken;

  return apiFetch(api["withdrawal"], { method: "GET", token });
};
