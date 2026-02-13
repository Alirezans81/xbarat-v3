import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Token } from "@/types/front/globals";
import {
  CreateWithdrawal,
  GetWithdrawalsFilters,
  UpdateWithdrawal,
  Withdrawal,
} from "@/types/front/wallet/withdrawal";

const api = routes();

export const getWithdrawals = (
  token: Token,
  filters?: GetWithdrawalsFilters
) => {
  return apiFetch<Withdrawal[]>(api["withdrawal"], {
    method: "GET",
    params: filters,
    token,
  });
};

export const createWithdrawal = (
  token: Token,
  withdrawal: CreateWithdrawal
) => {
  return apiFetch(api["withdrawal"], {
    method: "POST",
    body: withdrawal,
    token,
  });
};

export const updateWithdrawal = (
  token: Token,
  withdrawal_id: string,
  withdrawal: UpdateWithdrawal
) => {
  return apiFetch(api["withdrawal"] + "/" + withdrawal_id, {
    method: "PUT",
    body: withdrawal,
    token,
  });
};

export const deleteWithdrawal = (token: Token, withdrawal_id: string) => {
  return apiFetch(api["withdrawal"] + "/" + withdrawal_id, {
    method: "DELETE",
    token,
  });
};

export const approveWithdrawalDocument = (
  token: Token,
  withdrawal_id: string
) => {
  return apiFetch(
    api["withdrawal"] + "/" + withdrawal_id + "/approve-document",
    {
      method: "POST",
      token,
    }
  );
};
