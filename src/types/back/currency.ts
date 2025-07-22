import {
  Currency as DatabaseCurrency,
  PaymentChannel,
} from "@/generated/prisma";

export type Currency = Omit<DatabaseCurrency, "createdAt"> & {
  createdAt: string;
} & { paymentChannels: Pick<PaymentChannel, "id" | "name">[] };

export type GetCurrenciesFilters = {
  id?: string;
  code?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  paymentChannelId?: string;
};

export type CreateCurrency = {
  name: string;
  code: string;
  symbol: string;
  decimals: number;
  paymentChannelIds: string[];
};

export type UpdateCurrency = {
  name?: string;
  code?: string;
  symbol?: string;
  decimals?: number;
  paymentChannelIds?: string[];
};
