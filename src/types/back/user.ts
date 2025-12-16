import { User } from "@/generated/prisma";

export type GetUsersFilters = {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  countryCode?: string;
};

export type CreateUser = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  countryCode: string;
};

export type LoginUser = {
  email: string;
  password: string;
};

export type UpdateUser = Partial<Partial<User>> & {
  document?: File;
};
