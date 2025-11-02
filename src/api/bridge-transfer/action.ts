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
  const cookie = cookieStore.get("token");
  const token: Token = cookie
    ? { value: cookie.value, expiration: defaultToken.expiration }
    : defaultToken;

  return await apiFetch<BridgeTransfer[]>(api["bridge-transfer"], {
    params: { liquidityPoolId },
    token,
  });
}
