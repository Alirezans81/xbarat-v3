import axios from "axios";
import routes from "@/api/routes";
import { CreateOrUpdateCurrency } from "@/types/currency";

const api = routes();

export const getCurrencies = (token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(api["currency"], { headers });
};

export const createCurrency = (
  token: string,
  currency: CreateOrUpdateCurrency
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["currency"], currency, { headers });
};

export const updateCurrency = (
  token: string,
  currency_id: string,
  currency: CreateOrUpdateCurrency
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.put(api["currency"] + "/" + currency_id, currency, { headers });
};

export const deleteCurrency = (token: string, currency_id: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.delete(api["currency"] + "/" + currency_id, { headers });
};
