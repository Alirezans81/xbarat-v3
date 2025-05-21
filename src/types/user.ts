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
