import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import { createExchange } from "./api";
import { CreateExchange } from "@/types/front/wallet/exchange";

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
    await createExchange(token.value, exchange)
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
