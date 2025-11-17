import { useCheckTokenExpiration } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/front/stores/auth";
import { CreateFeeUser } from "@/types/front/feeUser";
import { FetchProps } from "@/types/front/globals";
import { useTranslations } from "next-intl";
import { activateFeeUser, createFeeUser, deleteFeeUser } from "./api";
import { toast } from "sonner";

type CreateFeeUserProps = {
  feeUser: CreateFeeUser;
};
export const useCreateFeeUser = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    feeUser,
    onError,
    onSuccess,
    onFinally,
  }: CreateFeeUserProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createFeeUser(token, feeUser)
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

type DeleteFeeUserProps = {
  feeUser_id: string;
};
export const useDeleteFeeUser = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    feeUser_id,
    onError,
    onSuccess,
    onFinally,
  }: DeleteFeeUserProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await deleteFeeUser(token, feeUser_id)
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

type ActivateFeeUserProps = {
  feeUser_id: string;
};
export const useActiveFeeUser = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    feeUser_id,
    onError,
    onSuccess,
    onFinally,
  }: ActivateFeeUserProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await activateFeeUser(token, feeUser_id)
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
