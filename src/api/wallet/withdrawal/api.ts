import axios from "axios";
import routes from "@/api/routes";
import {
  CreateWithdrawal,
  UpdateWithdrawal,
} from "@/types/front/wallet/withdrawal";

const api = routes();

export const getWithdrawals = (token: string, filters?: any) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(api["withdrawal"], { headers, params: filters });
};

export const createWithdrawal = (
  token: string,
  withdrawal: CreateWithdrawal
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["withdrawal"], withdrawal, { headers });
};

export const updateWithdrawal = (
  token: string,
  withdrawal_id: string,
  withdrawal: UpdateWithdrawal
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.put(api["withdrawal"] + "/" + withdrawal_id, withdrawal, {
    headers,
  });
};

export const deleteWithdrawal = (token: string, withdrawal_id: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.delete(api["withdrawal"] + "/" + withdrawal_id, { headers });
};

export const approveWithdrawalDocument = (
  token: string,
  withdrawal_id: string
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(
    api["withdrawal"] + "/" + withdrawal_id + "/approve-document",
    {},
    { headers }
  );
};
