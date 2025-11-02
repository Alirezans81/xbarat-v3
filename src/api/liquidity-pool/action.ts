"use server";

import routes from "@/api/routes";
import { LiquidityPool } from "@/types/front/liquidityPool";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/front/globals";
import { cookies } from "next/headers";

const api = routes();

export const getLiquidityPools = async (): Promise<LiquidityPool[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return apiFetch<LiquidityPool[]>(api["liquidity-pool"], {
    token,
  });
};

export const getLiquidityPoolById = async (
  id: string
): Promise<LiquidityPool> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return apiFetch<LiquidityPool>(`${api["liquidity-pool"]}/${id}`, {
    token,
  });
};

export const getLiquidityPoolsByCurrencyId = async (
  currencyId: string
): Promise<LiquidityPool[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return apiFetch<LiquidityPool[]>(api["liquidity-pool"], {
    params: { currencyId },
    token,
  });
};
