"use server";

import routes from "@/api/routes";
import { defaultToken, Token } from "@/types/front/globals";
import { LiquidityPool } from "@/types/front/liquidityPool";
import axios from "axios";
import { cookies } from "next/headers";

const api = routes();

export const getLiquidityPools = async (): Promise<{
  data: LiquidityPool[];
}> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };
  return axios.get(api["liquidity-pool"], { headers });
};

export const getLiquidityPoolById = async (
  id: string
): Promise<{ data: LiquidityPool }> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };
  return axios.get(api["liquidity-pool"] + "/" + id, { headers });
};

export const getLiquidityPoolsByCurrencyId = async (
  currencyId: string
): Promise<{
  data: LiquidityPool[];
}> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };
  return axios.get(api["liquidity-pool"], { headers, params: { currencyId } });
};
