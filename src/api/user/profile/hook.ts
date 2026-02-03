import { useCheckTokenExpiration } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/front/stores/auth";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { putUser } from "./api";
import { PutUser } from "@/types/front/user";
import { FetchProps } from "@/types/front/globals";

type PutUserPartial = {
  user: Partial<PutUser>;
};

export const usePutUser = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    user,
    onError,
    onSuccess,
    onFinally,
  }: PutUserPartial & FetchProps) => {
    checkTokenExpiration(async () => {
      await putUser(token, user)
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
