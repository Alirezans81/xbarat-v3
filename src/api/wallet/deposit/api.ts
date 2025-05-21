import axios from "axios";
import routes from "@/api/routes";
import { CreateOrUpdateDeposit } from "@/types/deposit";

const api = routes();

export const getDeposits = (token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(api["deposit"], { headers });
};

export const createDeposit = (
  token: string,
  deposit: CreateOrUpdateDeposit
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["deposit"], deposit, { headers });
};

export const updateDeposit = (
  token: string,
  deposit_id: string,
  deposit: CreateOrUpdateDeposit
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.put(api["deposit"] + "/" + deposit_id, deposit, { headers });
};

export const deleteDeposit = (token: string, deposit_id: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.delete(api["deposit"] + "/" + deposit_id, { headers });
};
