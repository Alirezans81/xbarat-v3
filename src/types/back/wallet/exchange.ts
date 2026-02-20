import {
  Exchange as DatabaseExchange,
  ExchangeStatus,
  User,
} from "@/generated/prisma";
import { Currency } from "../currency";
import { Decimal } from "@prisma/client/runtime/library";

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
  currencyPair: {
    fromCurrency: Pick<Currency, "id" | "code" | "symbol" | "paymentChannels">;
    toCurrency: Pick<Currency, "id" | "code" | "symbol" | "paymentChannels">;
    isInverseRate: boolean;
  };
};

export type GetExchangesFilters = {
  userId?: string;
  currencyPairId?: string;
  ltAmount?: number;
  gtAmount?: number;
  ltExchangeRate?: number;
  gtExchangeRate?: number;
  status?: ExchangeStatus[];
};

export type CreateExchange = {
  userId: string;
  currencyPairId: string;
  fromAmount: number;
  remainingAmount: number;
  toAmount: number;
  exchangeRate: number;
  fee: number;
  fundingSource?: "WALLET" | "LIQUIDITY_POOL";
};

export type UpdateExchange = {
  remainingAmount?: number;
  matchedAmount?: number;
  feePercentage?: number;
  status?: ExchangeStatus;
};

export type AggregatedExchange = {
  exchangeRate: Decimal;
  count: number;
  fromAmount: number | Decimal;
  latestCreatedAt: Date | null;
  currencyPair:
    | {
        id: string;
        isInverseRate: boolean;
        fromCurrency: Pick<Currency, "id" | "code" | "symbol">;
        toCurrency: Pick<Currency, "id" | "code" | "symbol">;
      }
    | undefined;
};
