import { User } from "@/generated/prisma";

export type Token = {
  value: string;
  expiration: string;
};
export const defaultToken: Token = {
  value: "",
  expiration: "",
};

export const defaultUser: User = {
  id: "",
  email: "",
  phoneNumber: "",
  fullName: "",
  avatarUrl: "",
  passwordHash: "",
  countryCode: "",
  nationality: "",
  language: "",
  kycStatus: "PENDING",
  documentType: null,
  documentNumber: "",
  documentPhotoUrl: "",
  dateOfBirth: null,
  address: "",
  postalCode: "",
  city: "",
  state: "",
  isPhoneVerified: false,
  isEmailVerified: false,
  isDeleted: false,
  role: "CUSTOMER",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export type CountryCode = {
  code: string;
  name: string;
  phoneCode: string;
  symbol: string;
};

export type FetchProps = {
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  onFinally?: () => void;
};
