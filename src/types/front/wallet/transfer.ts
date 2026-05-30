import { Transfer as DatabaseTransfer } from "@/generated/prisma";
import { Currency } from "../currency";
import { TransferStatus } from "@/generated/prisma";

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

export type GetTransfersFilters = {
  userId?: string;
  currencyId?: string;
  paymentChannelId?: string;
  status?: TransferStatus;
};

export type UpdateTransfer = {
  amount?: number;
  walletId?: string;
  paymentChannelId?: string;
};
