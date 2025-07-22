"use server";

import routes from "@/api/routes";
import { defaultToken, Token } from "@/types/globals";
import { Transfer } from "@/types/wallet/transfer";
import axios from "axios";
import { cookies } from "next/headers";

const api = routes();

export const getTransfers = async (): Promise<{ data: Transfer[] }> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };
  return axios.get(api["transfer"], { headers });
};
