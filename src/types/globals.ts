export type Token = {
  value: string;
  expiration: string;
};
export const defaultToken: Token = {
  value: "",
  expiration: "",
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
