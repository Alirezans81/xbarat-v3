import { FetchProps } from "@/types/front/globals";
import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import { createExchange, getExchanges, getLastExchanges } from "./api";
import {
  CreateExchange,
  Exchange,
  GetExchangesFilters,
} from "@/types/front/wallet/exchange";
import { Exchange as BackExchange } from "@/types/back/wallet/exchange";
import { CurrencyPair } from "@/types/back/currencyPair";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
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

type GetExchangeProps = {
  setExchanges: (value: Exchange[]) => void;
  filters?: GetExchangesFilters;
};

export const useGetExchange = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = useCallback(
    ({
      filters,
      setExchanges,
      onError,
      onSuccess,
      onFinally,
    }: GetExchangeProps & FetchProps) => {
      checkTokenExpiration(async () => {
        await getExchanges(token, filters)
          .then((res) => {
            setExchanges(res);
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
    },
    [checkTokenExpiration, t, token]
  );

  return fetch;
};

type GetExchangesProps = {
  currencyPairId: CurrencyPair["id"];
  setOrderBooks: (value: (BackExchange & { count: number })[]) => void;
};

export const useGetLastExchanges = () => {
  const t = useTranslations("ApiErrors");

  const fetch = useCallback(
    async ({
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
          if (process.env.NEXT_PUBLIC_APP_MODE === "development") {
            console.error(err.response);
          }
          toast.error(t(err.response.data.error.message));
          onError?.(err);
        })
        .finally(() => {
          onFinally?.();
        });
    },
    [t]
  );
  return fetch;
};
