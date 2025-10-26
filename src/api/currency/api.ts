import axios from "axios";
import routes from "@/api/routes";
import { CreateCurrency, UpdateCurrency } from "@/types/front/currency";

const api = routes();

export const getCurrencies = () => {
  return axios.get(api["currency"]);
};

export const createCurrency = (token: string, currency: CreateCurrency) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["currency"], currency, { headers });
};

export const updateCurrency = (
  token: string,
  currency_id: string,
  currency: UpdateCurrency
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
