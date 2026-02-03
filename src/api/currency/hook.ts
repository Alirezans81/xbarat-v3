import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import {
  createCurrency,
  deleteCurrency,
  getCurrencies,
  updateCurrency,
} from "./api";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import {
  CreateCurrency,
  Currency,
  UpdateCurrency,
} from "@/types/front/currency";

type GetCurrenciesProps = {
  setCurrencies: (value: Currency[]) => void;
};
export const useGetCurrencies = () => {
  const t = useTranslations("ApiErrors");

  const fetch = async ({
    setCurrencies,
    onError,
    onSuccess,
    onFinally,
  }: GetCurrenciesProps & FetchProps) => {
    await getCurrencies()
      .then((res) => {
        setCurrencies(res);
        onSuccess?.(res);
      })
      .catch((err) => {
        if (process.env.NEXT_PUBLIC_APP_MODE === "development") {
          console.error(err.response);
        }
        toast.error(t(err.response.data.error.message));
        onError?.(err);
      })
      .finally(() => {
        onFinally?.();
      });
  };

  return fetch;
};

type CreateCurrencyProps = {
  currency: CreateCurrency;
};
export const useCreateCurrency = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    currency,
    onError,
    onSuccess,
    onFinally,
  }: CreateCurrencyProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createCurrency(token, currency)
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err) => {
          if (process.env.NEXT_PUBLIC_APP_MODE === "development") {
            console.error(err.response);
          }
          toast.error(t(err.response.data.error.message));
          onError?.(err);
        })
        .finally(() => {
          onFinally?.();
        });
    });
  };

  return fetch;
};

type UpdateCurrencyProps = {
  currency_id: string;
  currency: UpdateCurrency;
};
export const useUpdateCurrency = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    currency_id,
    currency,
    onError,
    onSuccess,
    onFinally,
  }: UpdateCurrencyProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await updateCurrency(token, currency_id, currency)
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err) => {
          if (process.env.NEXT_PUBLIC_APP_MODE === "development") {
            console.error(err.response);
          }
          toast.error(t(err.response.data.error.message));
          onError?.(err);
        })
        .finally(() => {
          onFinally?.();
        });
    });
  };

  return fetch;
};

type DeleteCurrencyProps = {
  currency_id: string;
};
export const useDeleteCurrency = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    currency_id,
    onError,
    onSuccess,
    onFinally,
  }: DeleteCurrencyProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await deleteCurrency(token, currency_id)
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err) => {
          if (process.env.NEXT_PUBLIC_APP_MODE === "development") {
            console.error(err.response);
          }
          toast.error(t(err.response.data.error.message));
          onError?.(err);
        })
        .finally(() => {
          onFinally?.();
        });
    });
  };

  return fetch;
};
