import { FetchProps } from "@/types/front/globals";
import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import {
  approveWithdrawalDocument,
  createWithdrawal,
  deleteWithdrawal,
  getWithdrawals,
  updateWithdrawal,
} from "./api";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import {
  CreateWithdrawal,
  UpdateWithdrawal,
  GetWithdrawalsFilters,
  Withdrawal,
} from "@/types/front/wallet/withdrawal";

type GetWithdrawalsProps = {
  setWithdrawals: (value: Withdrawal[]) => void;
  filters?: GetWithdrawalsFilters;
};
export const useGetWithdrawals = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = useCallback(
    ({
      filters,
      setWithdrawals,
      onError,
      onSuccess,
      onFinally,
    }: GetWithdrawalsProps & FetchProps) => {
      checkTokenExpiration(async () => {
        await getWithdrawals(token, filters)
          .then((res) => {
            setWithdrawals(res);
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

type CreateWithdrawalProps = {
  withdrawal: CreateWithdrawal;
};
export const useCreateWithdrawal = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    withdrawal,
    onError,
    onSuccess,
    onFinally,
  }: CreateWithdrawalProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createWithdrawal(token, withdrawal)
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

type UpdateWithdrawalProps = {
  withdrawal_id: string;
  withdrawal: UpdateWithdrawal;
};
export const useUpdateWithdrawal = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    withdrawal_id,
    withdrawal,
    onError,
    onSuccess,
    onFinally,
  }: UpdateWithdrawalProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await updateWithdrawal(token, withdrawal_id, withdrawal)
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

type DeleteWithdrawalProps = {
  withdrawal_id: string;
};
export const useDeleteWithdrawal = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    withdrawal_id,
    onError,
    onSuccess,
    onFinally,
  }: DeleteWithdrawalProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await deleteWithdrawal(token, withdrawal_id)
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

type ApproveWithdrawalDocumentProps = {
  withdrawal_id: string;
};
export const useApproveWithdrawalDocument = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    withdrawal_id,
    onError,
    onSuccess,
    onFinally,
  }: ApproveWithdrawalDocumentProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await approveWithdrawalDocument(token, withdrawal_id)
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
