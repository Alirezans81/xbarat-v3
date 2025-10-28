import { Refund as DatabaseRefund } from "@/generated/prisma";
import { Currency } from "../currency";

export type Refund = Omit<
  DatabaseRefund,
  "createdAt" | "failedAt" | "completedAt"
> & {
  createdAt: string;
  failedAt: string;
  completedAt: string;
} & {
  wallet: {
    currency: Pick<Currency, "code" | "symbol" | "paymentChannels">;
  };
};

export type CreateRefund = {
  amount: number;
  walletId?: string;
  paymentChannelId: string;
};

export type UpdateRefund = {
  amount?: number;
  walletId?: string;
  paymentChannelId?: string;
};
