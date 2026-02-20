import {
  Exchange as DatabaseExchange,
  ExchangeStatus,
  User,
} from "@/generated/prisma";
import { CurrencyPair } from "../currencyPair";

export type Exchange = Omit<
  DatabaseExchange,
  "createdAt" | "failedAt" | "completedAt"
> & {
  createdAt: string;
  failedAt: string;
  completedAt: string;
} & {
  user: Pick<User, "fullName">;
} & {
  currencyPair: Pick<CurrencyPair, "fromCurrency" | "toCurrency">;
};

export type GetExchangesFilters = {
  userId?: string;
  currencyPairId?: string;
  ltAmount?: number;
  gtAmount?: number;
  ltExchangeRate?: number;
  gtExchangeRate?: number;
  status?: ExchangeStatus;
};

export type CreateExchange = {
  currencyPairId: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
};

export type UpdateExchange = {
  fromAmount?: number;
  remainingAmount?: number;
  toAmount?: number;
  exchangeRate?: number;
  feePercentage?: number;
  status?: ExchangeStatus;
};
