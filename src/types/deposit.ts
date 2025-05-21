import { Deposit as DatabaseDeposit, PaymentChannel } from "@/generated/prisma";
import { Currency } from "./currency";

export type CreateOrUpdateDeposit = {
  amount: number;
  walletId: string;
  paymentChannelId: string;
};

export type Deposit = Omit<
  DatabaseDeposit,
  "createdAt" | "failedAt" | "completedAt"
> & {
  createdAt: string;
  failedAt: string;
  completedAt: string;
} & {
  wallet: {
    currency: Pick<Currency, "code" | "symbol">;
  };
};
