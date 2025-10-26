import {
  Deposit as DatabaseDeposit,
  DepositStatus,
  User,
} from "@/generated/prisma";
import { Currency } from "../currency";
import { PaymentChannel } from "../paymentChannel";

export type Deposit = Omit<
  DatabaseDeposit,
  "createdAt" | "failedAt" | "completedAt"
> & {
  createdAt: string;
  failedAt: string;
  completedAt: string;
} & {
  user: Pick<User, "fullName">;
} & {
  wallet: {
    currency: Pick<Currency, "code" | "symbol" | "paymentChannels">;
  };
} & {
  paymentChannel: Pick<PaymentChannel, "name">;
};

export type GetDepositsFilters = {
  userId?: string;
  paymentChannelId?: string;
  currencyId?: string;
  status?: DepositStatus;
};

export type CreateDeposit = {
  userId: string;
  walletId: string;
  amount: number;
  paymentChannelId: string;
  status?: DepositStatus;
  documentUrl?: string;
};

export type UpdateDeposit = {
  amount?: number;
  walletId?: string;
  paymentChannelId?: string;
  status?: DepositStatus;
  documentUrl?: string;
};

export type UploadDepositDocument = {
  document: File;
};
