import axios from "axios";
import routes from "@/api/routes";
import { CreateUser, LoginUser } from "@/types/user";

const api = routes();

export const createUser = (user: CreateUser) => {
  return axios.post(api["user"], user);
};

export const loginUser = (params: LoginUser) => {
  return axios.post(api["login"], params);
};
