import { FeeUser as DatabaseFeeUser, User } from "@/generated/prisma";

export type FeeUser = Pick<DatabaseFeeUser, "id" | "userId" | "isActive"> & {
  user: Pick<User, "email" | "fullName">;
};

export type CreateFeeUser = {
  email: string;
};

export type GetFeeUserFilters = {
  userId?: string;
  isActive?: boolean;
};
