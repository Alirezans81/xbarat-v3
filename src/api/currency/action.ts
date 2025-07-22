"use server";

import routes from "@/api/routes";
import { Currency } from "@/types/currency";
import { defaultToken, Token } from "@/types/globals";
import axios from "axios";
import { cookies } from "next/headers";

const api = routes();

export const getCurrencies = async (): Promise<{ data: Currency[] }> => {
  return axios.get(api["currency"]);
};

export const getCurrencyById = async (
  id: string
): Promise<{ data: Currency }> => {
  return axios.get(api["currency"] + "/" + id);
};
