import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import { assign } from "./api";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import { Assign } from "@/types/front/wallet/assign";

export const useAssign = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    paymentChannelId,
    deposits,
    withdrawals,
    liquidityPools,
    onError,
    onSuccess,
    onFinally,
  }: Assign & FetchProps) => {
    checkTokenExpiration(async () => {
      await assign(token, {
        paymentChannelId,
        deposits,
        withdrawals,
        liquidityPools,
      })
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
