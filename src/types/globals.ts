export type Token = {
  access: string;
  access_exp: string;
  refresh: string;
  refresh_exp: string;
};
export const defaultToken: Token = {
  access: "",
  access_exp: "",
  refresh: "",
  refresh_exp: "",
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
