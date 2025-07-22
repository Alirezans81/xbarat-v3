import { CurrencyPair as DatabaseCurrencyPair } from "@/generated/prisma";

export type CurrencyPair = Omit<DatabaseCurrencyPair, "createdAt"> & {
  createdAt: string;
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
  isInverseRate?: boolean;
  isActive?: boolean;
};

export type UpdateCurrencyPair = {
  fromCurrencyId?: string;
  toCurrencyId?: string;
  rate?: number;
  isInverseRate?: boolean;
  isActive?: boolean;
};
