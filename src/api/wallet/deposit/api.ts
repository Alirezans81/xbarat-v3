import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Token } from "@/types/front/globals";
import {
  CreateDeposit,
  Deposit,
  UpdateDeposit,
  UploadDepositDocument,
} from "@/types/front/wallet/deposit";

const api = routes();

export const getDeposits = (token: Token, filters?: any) => {
  return apiFetch<Deposit[]>(api["deposit"], {
    method: "GET",
    params: filters,
    token,
  });
};

export const createDeposit = (token: Token, deposit: CreateDeposit) => {
  return apiFetch(api["deposit"], { method: "POST", body: deposit, token });
};

export const updateDeposit = (
  token: Token,
  deposit_id: string,
  deposit: UpdateDeposit
) => {
  return apiFetch(api["deposit"] + "/" + deposit_id, {
    method: "PUT",
    body: deposit,
    token,
  });
};

export const deleteDeposit = (token: Token, deposit_id: string) => {
  return apiFetch(api["deposit"] + "/" + deposit_id, {
    method: "DELETE",
    token,
  });
};

export const uploadDepositDocument = (
  token: Token,
  deposit_id: string,
  data: UploadDepositDocument
) => {
  const formData = new FormData();
  data.document && formData.append("document", data.document);

  return apiFetch(api["deposit"] + "/" + deposit_id + "/upload-document", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    token,
  });
};
