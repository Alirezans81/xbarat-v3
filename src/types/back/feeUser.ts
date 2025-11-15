import { FeeUser as feeUser } from "@/generated/prisma";

export type CreateFeeUser = feeUser;

export type GetFeeUserFilters = {
  id?: string;
  userId?: string;
  isActive?: boolean;
};
