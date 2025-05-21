import { PaymentChannel as DatabasePaymentChannel } from "@/generated/prisma";

export type CreateOrUpdatePaymentChannel = {
  name: string;
  description?: string;
};

export type PaymentChannel = Omit<DatabasePaymentChannel, "createdAt"> & {
  createdAt: string;
};
