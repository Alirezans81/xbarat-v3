import routes from "@/api/routes";
import { User } from "@/generated/prisma";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Token } from "@/types/back/globals";
import { CreateUser, LoginUser } from "@/types/front/user";
import { GetUser } from "@/types/front/user";
const api = routes();

type CreateUserResponse = {
  token: string;
  token_exp: string;
  user: User;
};
export const createUser = (user: CreateUser) => {
  return apiFetch<CreateUserResponse>(api["user"], {
    method: "POST",
    body: user,
  });
};

export const getUser = (token: Token) => {
  return apiFetch<GetUser>(api["user"], {
    method: "GET",
    token,
  });
};

type LoginUserResponse = {
  token: string;
  token_exp: string;
  user: User;
};
export const loginUser = (params: LoginUser) => {
  return apiFetch<LoginUserResponse>(api["login"], {
    method: "POST",
    body: params,
  });
};
