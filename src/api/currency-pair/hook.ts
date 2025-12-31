import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import {
  createCurrencyPair,
  deleteCurrencyPair,
  getCurrencyPairs,
  getWatchList,
  updateCurrencyPair,
} from "./api";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import {
  CreateCurrencyPair,
  CurrencyPair,
  UpdateCurrencyPair,
  WatchList,
} from "@/types/front/currencyPair";

type GetCurrenciesProps = {
  setCurrencyPairs: (value: CurrencyPair[]) => void;
};
export const useGetCurrencyPairs = () => {
  const t = useTranslations("ApiErrors");

  const fetch = async ({
    setCurrencyPairs,
    onError,
    onSuccess,
    onFinally,
  }: GetCurrenciesProps & FetchProps) => {
    await getCurrencyPairs()
      .then((res) => {
        setCurrencyPairs(res);
        onSuccess?.(res);
      })
      .catch((err) => {
        process.env.NEXT_PUBLIC_APP_MODE === "development" &&
          console.error(err.response);
        toast.error(t(err.response.data.error.message));
        onError?.(err);
      })
      .finally(() => {
        onFinally?.();
      });
  };

  return fetch;
};

type CreateCurrencyPairProps = {
  currencyPair: CreateCurrencyPair;
};
export const useCreateCurrencyPair = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    currencyPair,
    onError,
    onSuccess,
    onFinally,
  }: CreateCurrencyPairProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createCurrencyPair(token, currencyPair)
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err) => {
          process.env.NEXT_PUBLIC_APP_MODE === "development" &&
            console.error(err.response);
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

type UpdateCurrencyPairProps = {
  currencyPair_id: string;
  currencyPair: UpdateCurrencyPair;
};
export const useUpdateCurrencyPair = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    currencyPair_id,
    currencyPair,
    onError,
    onSuccess,
    onFinally,
  }: UpdateCurrencyPairProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await updateCurrencyPair(token, currencyPair_id, currencyPair)
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err) => {
          process.env.NEXT_PUBLIC_APP_MODE === "development" &&
            console.error(err.response);
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

type DeleteCurrencyPairProps = {
  currencyPair_id: string;
};
export const useDeleteCurrencyPair = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    currencyPair_id,
    onError,
    onSuccess,
    onFinally,
  }: DeleteCurrencyPairProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await deleteCurrencyPair(token, currencyPair_id)
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err) => {
          process.env.NEXT_PUBLIC_APP_MODE === "development" &&
            console.error(err.response);
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

type GetWatchListProps = {
  setWatchList: (value: WatchList[]) => void;
};
export const useGetWatchList = () => {
  const t = useTranslations("ApiErrors");

  const fetch = async ({
    setWatchList,
    onError,
    onSuccess,
    onFinally,
  }: GetWatchListProps & FetchProps) => {
    await getWatchList()
      .then((res) => {
        setWatchList(res);
        onSuccess?.(res);
      })
      .catch((err) => {
        process.env.NEXT_PUBLIC_APP_MODE === "development" &&
          console.error(err.response);
        toast.error(t(err.response.data.error.message));
        onError?.(err);
      })
      .finally(() => {
        onFinally?.();
      });
  };

  return fetch;
};
