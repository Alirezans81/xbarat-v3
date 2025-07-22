import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import {
  createTransfer,
  deleteTransfer,
  getTransfers,
  updateTransfer,
} from "./api";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import {
  CreateTransfer,
  UpdateTransfer,
  Transfer,
} from "@/types/front/wallet/transfer";

type GetTransfersProps = {
  setTransfers: (value: Transfer[]) => void;
  filters?: {
    userId: string;
  };
};
export const useGetTransfers = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    filters,
    setTransfers,
    onError,
    onSuccess,
    onFinally,
  }: GetTransfersProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await getTransfers(token.value, filters)
        .then((res) => {
          setTransfers(res.data);
          onSuccess?.(res);
        })
        .catch((err) => {
          process.env.NEXT_PUBLIC_APP_MODE === "development" &&
            console.error(err.response);
          toast(t(err.response.data.error.message));
          onError?.(err);
        })
        .finally(() => {
          onFinally?.();
        });
    });
  };

  return fetch;
};

type CreateTransferProps = {
  transfer: CreateTransfer;
};
export const useCreateTransfer = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    transfer,
    onError,
    onSuccess,
    onFinally,
  }: CreateTransferProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createTransfer(token.value, transfer)
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err) => {
          process.env.NEXT_PUBLIC_APP_MODE === "development" &&
            console.error(err.response);
          toast(t(err.response.data.error.message));
          onError?.(err);
        })
        .finally(() => {
          onFinally?.();
        });
    });
  };

  return fetch;
};

type UpdateTransferProps = {
  transfer_id: string;
  transfer: UpdateTransfer;
};
export const useUpdateTransfer = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    transfer_id,
    transfer,
    onError,
    onSuccess,
    onFinally,
  }: UpdateTransferProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await updateTransfer(token.value, transfer_id, transfer)
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err) => {
          process.env.NEXT_PUBLIC_APP_MODE === "development" &&
            console.error(err.response);
          toast(t(err.response.data.error.message));
          onError?.(err);
        })
        .finally(() => {
          onFinally?.();
        });
    });
  };

  return fetch;
};

type DeleteTransferProps = {
  transfer_id: string;
};
export const useDeleteTransfer = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    transfer_id,
    onError,
    onSuccess,
    onFinally,
  }: DeleteTransferProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await deleteTransfer(token.value, transfer_id)
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err) => {
          process.env.NEXT_PUBLIC_APP_MODE === "development" &&
            console.error(err.response);
          toast(t(err.response.data.error.message));
          onError?.(err);
        })
        .finally(() => {
          onFinally?.();
        });
    });
  };

  return fetch;
};
