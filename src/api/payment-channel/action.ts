"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/back/globals";
import { PaymentChannel } from "@/types/front/paymentChannel";
import { cookies } from "next/dist/server/request/cookies";

const api = routes();

export const getPaymentChannels = async (): Promise<PaymentChannel[]> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("token");
  const token: Token = cookie
    ? { value: cookie.value, expiration: defaultToken.expiration }
    : defaultToken;

  return apiFetch(api["payment-channel"], { token });
};
