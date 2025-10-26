import {
  Currency,
  Wallet as DatabaseWallet,
  PaymentChannel,
  User,
} from "@/generated/prisma";

export type Wallet = DatabaseWallet & {
  user: Pick<User, "id" | "email" | "fullName" | "avatarUrl">;
  currency: Pick<Currency, "code" | "symbol"> & {
    paymentChannels: Pick<PaymentChannel, "id" | "name">[];
  };
};

export type GetWalletsFilters = {
  userId?: string;
  currencyId?: string;
  paymentChannelId?: string;
};

export type UpdateWallet = {
  balance?: number;
  frozen?: number;
};
