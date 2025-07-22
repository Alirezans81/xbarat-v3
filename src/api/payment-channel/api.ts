import axios from "axios";
import routes from "@/api/routes";
import {
  CreatePaymentChannel,
  UpdatePaymentChannel,
} from "@/types/paymentChannel";

const api = routes();

export const getPaymentChannels = (token: string, filters?: any) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(api["payment-channel"], { headers, params: filters });
};

export const createPaymentChannel = (
  token: string,
  paymentChannel: CreatePaymentChannel
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["payment-channel"], paymentChannel, { headers });
};

export const updatePaymentChannel = (
  token: string,
  paymentChannel_id: string,
  paymentChannel: UpdatePaymentChannel
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.put(
    api["payment-channel"] + "/" + paymentChannel_id,
    paymentChannel,
    { headers }
  );
};

export const deletePaymentChannel = (
  token: string,
  paymentChannel_id: string
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.delete(api["payment-channel"] + "/" + paymentChannel_id, {
    headers,
  });
};
