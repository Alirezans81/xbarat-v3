import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Token } from "@/types/front/globals";
import { User } from "@/generated/prisma";
import { PutUser } from "@/types/front/user";
import routes from "../../routes";

const api = routes();

export const putUser = (token: Token, user: Partial<PutUser>) => {
  return apiFetch<User>(api["user"] + "/profile/", {
    method: "PUT",
    body: user,
    token,
  });
};
