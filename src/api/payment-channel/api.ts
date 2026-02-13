import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Token } from "@/types/front/globals";
import {
  CreatePaymentChannel,
  GetPaymentChannelsFilters,
  PaymentChannel,
  UpdatePaymentChannel,
} from "@/types/front/paymentChannel";

const api = routes();

export const getPaymentChannels = (
  token: Token,
  filters?: GetPaymentChannelsFilters
) => {
  return apiFetch<PaymentChannel[]>(api["payment-channel"], {
    params: filters,
    token,
  });
};

export const createPaymentChannel = (
  token: Token,
  paymentChannel: CreatePaymentChannel
) => {
  return apiFetch<PaymentChannel>(api["payment-channel"], {
    method: "POST",
    body: paymentChannel,
    token,
  });
};

export const updatePaymentChannel = (
  token: Token,
  paymentChannel_id: string,
  paymentChannel: UpdatePaymentChannel
) => {
  return apiFetch<PaymentChannel>(
    api["payment-channel"] + "/" + paymentChannel_id,
    { method: "PUT", body: paymentChannel, token }
  );
};

export const deletePaymentChannel = (
  token: Token,
  paymentChannel_id: string
) => {
  return apiFetch<PaymentChannel>(
    api["payment-channel"] + "/" + paymentChannel_id,
    { method: "DELETE", token }
  );
};
