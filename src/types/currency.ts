import {
  Currency as DatabaseCurrency,
  PaymentChannel,
} from "@/generated/prisma";

export type CreateOrUpdateCurrency = {
  name: string;
  code: string;
  symbol: string;
  decimals: number;
  paymentChannelIds: string[];
};

export type Currency = Omit<DatabaseCurrency, "createdAt"> & {
  createdAt: string;
} & { paymentChannels: Pick<PaymentChannel, "id" | "name">[] };
