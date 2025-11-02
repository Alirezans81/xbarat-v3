"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { Deposit } from "@/types/front/wallet/deposit";
import { cookies } from "next/dist/server/request/cookies";

const api = routes();

export const getDeposits = async (): Promise<Deposit[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return apiFetch(api["deposit"], { method: "GET", token });
};
