import { FeeUser } from "@/types/front/feeUser";
import routes from "../routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { cookies } from "next/headers";
import { defaultToken, Token } from "@/types/front/globals";

const api = routes();

export const getFeeUsers = async (): Promise<FeeUser[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return await apiFetch<FeeUser[]>(api["fee-user"], {
    token,
  });
};
