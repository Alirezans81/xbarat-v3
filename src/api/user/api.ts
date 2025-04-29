import { User } from "@/generated/prisma";
import axios from "axios";
import routes from "@/api/routes";

const api = routes();

export const createUser = (token: string, user: User) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["user"], user, { headers });
};
