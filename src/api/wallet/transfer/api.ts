import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Token } from "@/types/front/globals";
import {
  CreateTransfer,
  Transfer,
  UpdateTransfer,
} from "@/types/front/wallet/transfer";

const api = routes();

export const getTransfers = (
  token: Token,
  filters?: { userId?: string }
) => {
  return apiFetch<Transfer[]>(api["transfer"], {
    method: "GET",
    params: filters,
    token,
  });
};

export const createTransfer = (token: Token, transfer: CreateTransfer) => {
  return apiFetch(api["transfer"], { method: "POST", body: transfer, token });
};

export const updateTransfer = (
  token: Token,
  transfer_id: string,
  transfer: UpdateTransfer
) => {
  return apiFetch(api["transfer"] + "/" + transfer_id, {
    method: "PUT",
    body: transfer,
    token,
  });
};

export const deleteTransfer = (token: Token, transfer_id: string) => {
  return apiFetch(api["transfer"] + "/" + transfer_id, {
    method: "DELETE",
    token,
  });
};
