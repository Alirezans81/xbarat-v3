import axios from "axios";
import routes from "@/api/routes";

const api = routes();

export const getWallets = (token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(api["wallet"], { headers });
};
