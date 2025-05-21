"use server";

import routes from "@/api/routes";
import { defaultToken, Token } from "@/types/globals";
import { Deposit } from "@/types/deposit";
import axios from "axios";
import { cookies } from "next/headers";

const api = routes();

export const getDeposits = async (): Promise<{ data: Deposit[] }> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };
  return axios.get(api["deposit"], { headers });
};
