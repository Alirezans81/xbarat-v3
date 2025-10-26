import { PaymentChannel as DatabasePaymentChannel } from "@/generated/prisma";

export type PaymentChannel = Omit<DatabasePaymentChannel, "createdAt"> & {
  createdAt: string;
};

export type GetPaymentChannelsFilters = {
  currencyId?: string;
};

export type CreatePaymentChannel = {
  name: string;
  description?: string;
};

export type UpdatePaymentChannel = {
  name?: string;
  description?: string;
};
