import { ExchangeMatch as DatabaseExchangeMatch } from "@/generated/prisma";

export type ExchangeMatch = Omit<
  DatabaseExchangeMatch,
  "createdAt" | "failedAt" | "completedAt"
> & {
  createdAt: string;
  failedAt: string;
  completedAt: string;
};

export type GetExchangeMatchsFilters = {
  fromExchangeId?: string;
  toExchangeId?: string;
  fromMatchedAmountLessThan?: number;
  fromMatchedAmountGreaterThan?: number;
  toMatchedAmountLessThan?: number;
  toMatchedAmountGreaterThan?: number;
};

export type CreateExchangeMatch = {
  fromExchangeId: string;
  toExchangeId: string;
  fromMatchedAmount: number;
  toMatchedAmount: number;
};

export type UpdateExchangeMatch = {
  fromMatchedAmount?: number;
  toMatchedAmount?: number;
};
