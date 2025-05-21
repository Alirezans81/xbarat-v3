import {
  Currency,
  Wallet as DatabaseWallet,
  PaymentChannel,
} from "@/generated/prisma";

export type Wallet = DatabaseWallet & {
  currency: Pick<Currency, "code" | "symbol"> & {
    paymentChannels: Pick<PaymentChannel, "id" | "name">[];
  };
};
