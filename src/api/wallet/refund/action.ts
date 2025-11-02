"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { Refund } from "@/types/front/wallet/refund";
import { cookies } from "next/headers";

const api = routes();

export const getRefunds = async (): Promise<Refund[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;
  return apiFetch<Refund[]>(api["refund"], {
    method: "GET",
    token,
  });
};
