import { CurrencyPair as DatabaseCurrencyPair } from "@/generated/prisma";
import { Currency } from "./currency";

export type CurrencyPair = Omit<DatabaseCurrencyPair, "createdAt"> & {
  createdAt: string;
} & {
  fromCurrency: Pick<Currency, "code" | "name" | "symbol">;
  toCurrency: Pick<Currency, "code" | "name" | "symbol">;
};

export type GetCurrencyPairsFilters = {
  id?: string;
  fromCurrencyId?: string;
  toCurrencyId?: string;
  rate?: number;
  isInverseRate?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateCurrencyPair = {
  fromCurrencyId: string;
  toCurrencyId: string;
  rate: number;
  feePercentage: number;
  isInverseRate?: boolean;
  isActive?: boolean;
};

export type UpdateCurrencyPair = {
  fromCurrencyId?: string;
  toCurrencyId?: string;
  rate?: number;
  feePercentage?: number;
  isInverseRate?: boolean;
  isActive?: boolean;
};
