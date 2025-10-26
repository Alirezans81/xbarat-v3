import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import { getWallets } from "./api";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import { Wallet } from "@/types/front/wallet";

type GetWalletsProps = {
  setWallets: (value: Wallet[]) => void;
};
export const useGetWallets = () => {
  const t = useTranslations("ApiErrors");

  const { token } = useAuthStore();

  const fetch = async ({
    setWallets,
    onError,
    onSuccess,
    onFinally,
  }: GetWalletsProps & FetchProps) => {
    await getWallets(token.value)
      .then((res) => {
        setWallets(res.data);
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
