import { Transfer as DatabaseTransfer } from "@/generated/prisma";
import { Currency } from "../../currency";

export type Transfer = Omit<
  DatabaseTransfer,
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

export type CreateTransfer = {
  amount: number;
  walletId?: string;
  paymentChannelId: string;
};

export type UpdateTransfer = {
  amount?: number;
  walletId?: string;
  paymentChannelId?: string;
};
