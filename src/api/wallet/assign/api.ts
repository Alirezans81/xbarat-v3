import axios from "axios";
import routes from "@/api/routes";
import { Assign } from "@/types/front/wallet/assign";

const api = routes();

export const assign = (token: string, data: Assign) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["assign"], data, { headers });
};
