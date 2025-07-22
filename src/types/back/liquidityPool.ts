import {
  LiquidityPool as DatabaseLiquidityPool,
  User,
} from "@/generated/prisma";
import { Currency } from "./currency";
import { PaymentChannel } from "./paymentChannel";

export type LiquidityPool = Omit<DatabaseLiquidityPool, "updatedAt"> & {
  updatedAt: string;
} & {
  user: Pick<User, "fullName">;
} & {
  currency: Pick<Currency, "code" | "symbol" | "name">;
} & {
  paymentChannel: Pick<PaymentChannel, "name">;
};

export type GetLiquidityPoolsFilters = {
  userId?: string;
  currencyId?: string;
  paymentChannelId?: string;
  address?: string;
};

export type CreateLiquidityPool = {
  currencyId: string;
  paymentChannelId: string;
  address: string;
  balance: number;
  frozen: number;
};

export type UpdateLiquidityPool = {
  currencyId?: string;
  paymentChannelId?: string;
  address?: string;
  balance?: number;
  frozen?: number;
};
