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
  data.documents.forEach((item, index) => {
    formData.append(`items[${index}][bridgeTransferId]`, item.bridgeTransferId);
    formData.append(`items[${index}][document]`, item.document);
  });

  return apiFetch(api["deposit"] + "/" + deposit_id + "/upload-document", {
    method: "POST",
    body: formData,
    token,
  });
};

export const getMatchedDepositBridgeTransfers = (
  token: Token,
  deposit_id: string
) => {
  return apiFetch<any[]>(
    api["deposit"] + "/" + deposit_id + "/matched-bridge-transfers",
    {
      method: "GET",
      token,
    }
  );
};

export const getMatchedLiquidityPoolBridgeTransfers = (
  token: Token,
  liquidityPool_id: string
) => {
  return apiFetch<any[]>(
    api["liquidity-pool"] +
      "/" +
      liquidityPool_id +
      "/matched-bridge-transfers",
    {
      method: "GET",
      token,
    }
  );
};
