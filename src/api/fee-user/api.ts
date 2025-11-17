import { apiFetch } from "@/lib/front/utils/apiFetch";
import { CreateFeeUser, FeeUser } from "@/types/front/feeUser";
import { Token } from "@/types/front/globals";
import routes from "../routes";

const api = routes();

export const createFeeUser = (token: Token, feeUser: CreateFeeUser) => {
  return apiFetch<FeeUser>(api["fee-user"], {
    method: "POST",
    body: feeUser,
    token,
  });
};

export const deleteFeeUser = (token: Token, feeUser_id: string) => {
  return apiFetch<void>(`${api["fee-user"]}/${feeUser_id}`, {
    method: "DELETE",
    token,
  });
};

export const activateFeeUser = (token: Token, feeUser_id: string) => {
  return apiFetch<void>(`${api["fee-user"]}/${feeUser_id}/only-active`, {
    method: "POST",
    token,
  });
};
