"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { Refund } from "@/types/front/wallet/refund";
import { cookies } from "next/headers";

const api = routes();

export const getRefunds = async (): Promise<Refund[]> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("token");
  const token: Token = cookie
    ? { value: cookie.value, expiration: defaultToken.expiration }
    : defaultToken;
  return apiFetch<Refund[]>(api["refund"], {
    method: "GET",
    token,
  });
};
