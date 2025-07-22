import axios from "axios";
import routes from "@/api/routes";
import { CreateCurrencyPair, UpdateCurrencyPair } from "@/types/currencyPair";

const api = routes();

export const getCurrencyPairs = () => {
  return axios.get(api["currency-pair"]);
};

export const createCurrencyPair = (
  token: string,
  currencyPair: CreateCurrencyPair
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["currency-pair"], currencyPair, { headers });
};

export const updateCurrencyPair = (
  token: string,
  currencyPair_id: string,
  currencyPair: UpdateCurrencyPair
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.put(api["currency-pair"] + "/" + currencyPair_id, currencyPair, {
    headers,
  });
};

export const deleteCurrencyPair = (token: string, currencyPair_id: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.delete(api["currency-pair"] + "/" + currencyPair_id, {
    headers,
  });
};
