"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { PaymentChannel } from "@/types/front/paymentChannel";
import { cookies } from "next/dist/server/request/cookies";

const api = routes();

export const getPaymentChannels = async (): Promise<PaymentChannel[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return apiFetch(api["payment-channel"], { token });
};
