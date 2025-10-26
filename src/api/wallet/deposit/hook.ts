import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import {
  createDeposit,
  deleteDeposit,
  getDeposits,
  updateDeposit,
  uploadDepositDocument,
} from "./api";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import {
  CreateDeposit,
  Deposit,
  GetDepositsFilters,
  UpdateDeposit,
  UploadDepositDocument,
} from "@/types/front/wallet/deposit";

type GetDepositsProps = {
  setDeposits: (value: Deposit[]) => void;
  filters?: GetDepositsFilters;
};
export const useGetDeposits = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    filters,
    setDeposits,
    onError,
    onSuccess,
    onFinally,
  }: GetDepositsProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await getDeposits(token.value, filters)
        .then((res) => {
          setDeposits(res.data);
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

type CreateDepositProps = {
  deposit: CreateDeposit;
};
export const useCreateDeposit = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    deposit,
    onError,
    onSuccess,
    onFinally,
  }: CreateDepositProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createDeposit(token.value, deposit)
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

type UpdateDepositProps = {
  deposit_id: string;
  deposit: UpdateDeposit;
};
export const useUpdateDeposit = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    deposit_id,
    deposit,
    onError,
    onSuccess,
    onFinally,
  }: UpdateDepositProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await updateDeposit(token.value, deposit_id, deposit)
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

type DeleteDepositProps = {
  deposit_id: string;
};
export const useDeleteDeposit = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    deposit_id,
    onError,
    onSuccess,
    onFinally,
  }: DeleteDepositProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await deleteDeposit(token.value, deposit_id)
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

type UploadDepositDocumentProps = {
  deposit_id: string;
  data: UploadDepositDocument;
};
export const useUploadDepositDocument = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    deposit_id,
    data,
    onError,
    onSuccess,
    onFinally,
  }: UploadDepositDocumentProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await uploadDepositDocument(token.value, deposit_id, data)
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
