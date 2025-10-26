import axios from "axios";
import routes from "@/api/routes";
import { CreateExchange } from "@/types/front/wallet/exchange";

const api = routes();

export const createExchange = (token: string, exchange: CreateExchange) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["exchange"], exchange, { headers });
};
