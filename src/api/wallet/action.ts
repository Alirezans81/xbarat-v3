"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { Wallet } from "@/types/front/wallet";
import { cookies } from "next/dist/server/request/cookies";

const api = routes();

export const getWallets = async (): Promise<Wallet[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return apiFetch<Wallet[]>(api["wallet"], {
    method: "GET",
    token,
  });
};
