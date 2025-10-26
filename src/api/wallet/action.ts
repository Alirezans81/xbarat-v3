"use server";

import routes from "@/api/routes";
import { defaultToken, Token } from "@/types/front/globals";
import { Wallet } from "@/types/front/wallet";
import axios from "axios";
import { cookies } from "next/headers";

const api = routes();

export const getWallets = async (): Promise<{ data: Wallet[] }> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };

  try {
    return await axios.get(api["wallet"], { headers });
  } catch (error) {
    return { data: [] };
  }
};
