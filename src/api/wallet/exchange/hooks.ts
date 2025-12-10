import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import { createExchange, getLastExchanges } from "./api";
import { CreateExchange } from "@/types/front/wallet/exchange";
import { Exchange } from "@/types/back/wallet/exchange";
import { CurrencyPair } from "@/types/back/currencyPair";
import { useCallback } from "react";
type CreateExchangeProps = {
  exchange: CreateExchange;
};
export const useCreateExchange = () => {
  const t = useTranslations("ApiErrors");

  const { token } = useAuthStore();

  const fetch = async ({
    exchange,
    onError,
    onSuccess,
    onFinally,
  }: CreateExchangeProps & FetchProps) => {
    await createExchange(token, exchange)
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
  };

  return fetch;
};

type GetExchangesProps = {
  currencyPairId: CurrencyPair["id"];
  setOrderBooks: (value: (Exchange & { count: Number })[]) => void;
};

export const useGetLastExchanges = () => {
  const t = useTranslations("ApiErrors");

  const fetch = async ({
    currencyPairId,
    setOrderBooks,
    onError,
    onSuccess,
    onFinally,
  }: GetExchangesProps & FetchProps) => {
    await getLastExchanges(currencyPairId)
      .then((res) => {
        setOrderBooks(res);
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
