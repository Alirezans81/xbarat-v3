import {
  Withdrawal as DatabaseWithdrawal,
  User,
  WithdrawalStatus,
} from "@/generated/prisma";
import { Currency } from "../currency";
import { PaymentChannel } from "../paymentChannel";

export type Withdrawal = Omit<
  DatabaseWithdrawal,
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
} & {
  BridgeTransfer: {
    id: string;
    status: string;
    documentUrl: string | null;
  } | null;
};

export type GetWithdrawalsFilters = {
  userId?: string;
  paymentChannelId?: string;
  currencyId?: string;
  status?: WithdrawalStatus;
};

export type CreateWithdrawal = {
  amount: number;
  walletId: string;
  paymentChannelId: string;
  receiverAddress: string;
  addressOwnerName: string;
  status?: WithdrawalStatus;
};

export type UpdateWithdrawal = {
  amount?: number;
  paymentChannelId?: string;
  receiverAddress?: string;
  addressOwnerName?: string;
  documentUrl?: string;
  status?: WithdrawalStatus;
};
