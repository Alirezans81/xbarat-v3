"use server";

import routes from "@/api/routes";
import { Currency } from "@/types/currency";
import { defaultToken, Token } from "@/types/globals";
import axios from "axios";
import { cookies } from "next/headers";

const api = routes();

export const getCurrencies = async (): Promise<{ data: Currency[] }> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };
  return axios.get(api["currency"], { headers });
};
