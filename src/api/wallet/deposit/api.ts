import axios from "axios";
import routes from "@/api/routes";
import {
  CreateDeposit,
  UpdateDeposit,
  UploadDepositDocument,
} from "@/types/wallet/deposit";

const api = routes();

export const getDeposits = (token: string, filters?: any) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(api["deposit"], { headers, params: filters });
};

export const createDeposit = (token: string, deposit: CreateDeposit) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["deposit"], deposit, { headers });
};

export const updateDeposit = (
  token: string,
  deposit_id: string,
  deposit: UpdateDeposit
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.put(api["deposit"] + "/" + deposit_id, deposit, { headers });
};

export const deleteDeposit = (token: string, deposit_id: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.delete(api["deposit"] + "/" + deposit_id, { headers });
};

export const uploadDepositDocument = (
  token: string,
  deposit_id: string,
  data: UploadDepositDocument
) => {
  const formData = new FormData();
  data.document && formData.append("document", data.document);

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(
    api["deposit"] + "/" + deposit_id + "/upload-document",
    formData,
    { headers }
  );
};
