import { FeeUser as DatabaseFeeUser } from "@/generated/prisma";

export type FeeUser = Pick<
  DatabaseFeeUser,
  "userId" | "isActive" | "createdAt" | "updatedAt"
>;

export type CreateFeeUser = {
  userId: string;
};

export type GetFeeUserFilters = {
  userId?: string;
  isActive?: boolean;
};
