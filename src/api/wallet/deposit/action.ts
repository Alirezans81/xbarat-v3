"use server";

import routes from "@/api/routes";
import { defaultToken, defaultUser, Token } from "@/types/globals";
import { Deposit } from "@/types/deposit";
import axios from "axios";
import { cookies } from "next/headers";
import { User } from "@/generated/prisma";
import qs from "query-string";

const api = routes();

export const getDeposits = async (): Promise<{ data: Deposit[] }> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token: Token = tokenCookie
    ? JSON.parse(tokenCookie.value)
    : defaultToken;
  const userCookie = cookieStore.get("user");
  const user: User = userCookie ? JSON.parse(userCookie.value) : defaultUser;

  const url =
    user.role === "ADMIN"
      ? qs.stringifyUrl({
          url: api["deposit"],
          query: {
            userId: user.id,
          },
        })
      : api["deposit"];

  const headers = {
    Authorization: `Bearer ${token.value}`,
  };
  return axios.get(url, { headers });
};
