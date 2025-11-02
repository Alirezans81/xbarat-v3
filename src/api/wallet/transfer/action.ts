"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { Transfer } from "@/types/front/wallet/transfer";
import { cookies } from "next/dist/server/request/cookies";

const api = routes();

export const getTransfers = async (): Promise<Transfer[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return apiFetch(api["transfer"], { method: "GET", token });
};
