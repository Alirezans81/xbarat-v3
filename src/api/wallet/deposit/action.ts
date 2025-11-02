"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { Deposit } from "@/types/front/wallet/deposit";
import { cookies } from "next/dist/server/request/cookies";

const api = routes();

export const getDeposits = async (): Promise<Deposit[]> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("token");
  const token: Token = cookie
    ? { value: cookie.value, expiration: defaultToken.expiration }
    : defaultToken;

  return apiFetch(api["deposit"], { method: "GET", token });
};
