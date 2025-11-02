"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { BridgeTransfer } from "@/types/front/bridgeTransfer";
import { defaultToken, Token } from "@/types/front/globals";
import { cookies } from "next/headers";

const api = routes();

export async function getBridgeTransfersByLiquidityPoolId(
  liquidityPoolId: string
): Promise<BridgeTransfer[]> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return await apiFetch<BridgeTransfer[]>(api["bridge-transfer"], {
    params: { liquidityPoolId },
    token,
  });
}
