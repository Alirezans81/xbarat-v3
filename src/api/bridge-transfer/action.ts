"use server";

import routes from "@/api/routes";
import { BridgeTransfer } from "@/types/bridgeTransfer";
import { defaultToken, Token } from "@/types/globals";
import axios from "axios";
import { cookies } from "next/headers";

const api = routes();

export async function getBridgeTransfersByLiquidityPoolId(
  liquidityPoolId: string
): Promise<{ data: BridgeTransfer[] }> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };
  return axios.get(api["bridge-transfer"], {
    headers,
    params: { liquidityPoolId },
  });
}
