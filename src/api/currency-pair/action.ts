"use server";

import routes from "@/api/routes";
import { CurrencyPair } from "@/types/front/currencyPair";
import { defaultToken, Token } from "@/types/front/globals";
import axios from "axios";
import { cookies } from "next/headers";

const api = routes();

export const getCurrencyPairs = async (): Promise<{
  data: CurrencyPair[];
}> => {
  return axios.get(api["currency-pair"]);
};

export const getCurrencyPairById = async (
  id: string
): Promise<{ data: CurrencyPair }> => {
  return axios.get(api["currency-pair"] + "/" + id);
};
