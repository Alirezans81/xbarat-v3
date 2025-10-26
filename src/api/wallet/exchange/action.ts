"use server";

import routes from "@/api/routes";
import { defaultToken, Token } from "@/types/front/globals";
import { Exchange } from "@/types/front/wallet/exchange";
import axios from "axios";
import { cookies } from "next/headers";

const api = routes();

export const getExchanges = async (): Promise<{ data: Exchange[] }> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };
  return axios.get(api["exchange"], { headers });
};
