import axios from "axios";
import routes from "@/api/routes";
import { CreateTransfer, UpdateTransfer } from "@/types/front/wallet/transfer";

const api = routes();

export const getTransfers = (token: string, filters?: any) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(api["transfer"], { headers, params: filters });
};

export const createTransfer = (token: string, transfer: CreateTransfer) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["transfer"], transfer, { headers });
};

export const updateTransfer = (
  token: string,
  transfer_id: string,
  transfer: UpdateTransfer
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.put(api["transfer"] + "/" + transfer_id, transfer, { headers });
};

export const deleteTransfer = (token: string, transfer_id: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.delete(api["transfer"] + "/" + transfer_id, { headers });
};
