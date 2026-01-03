export type GetUsersFilters = {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  countryCode?: string;
};

export type GetUser = {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  state: string;
  avatarUrl: string;
  countryCode: string;
  city: string;
  documentType: string;
  documentPhotoUrl: string;
  documentNumber: string;
  address: string;
  postalCode: string;
  dateOfBirth: string;
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

export type PutUser = {
  avatarUrl: string;
  fullName: string;
  phoneNumber: string;
  documentPhotoUrl: string;
  countryCode: string;
  state: string;
  city: string;
  postalCode: string;
  address: string;
};
