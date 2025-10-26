import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import {
  getLiquidityPools,
  createLiquidityPool,
  updateLiquidityPool,
  deleteLiquidityPool,
  approveLiquidityPoolDocument,
  uploadLiquidityPoolDocument,
} from "./api";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import {
  CreateLiquidityPool,
  UpdateLiquidityPool,
  GetLiquidityPoolsFilters,
  LiquidityPool,
} from "@/types/front/liquidityPool";

type GetLiquidityPoolsProps = {
  setLiquidityPools: (value: LiquidityPool[]) => void;
  filters?: GetLiquidityPoolsFilters;
};
export const useGetLiquidityPools = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    setLiquidityPools,
    filters,
    onError,
    onSuccess,
    onFinally,
  }: GetLiquidityPoolsProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await getLiquidityPools(token.value, filters)
        .then((res) => {
          setLiquidityPools(res.data);
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

type CreateLiquidityPoolProps = {
  liquidityPool: CreateLiquidityPool;
};
export const useCreateLiquidityPool = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    liquidityPool,
    onError,
    onSuccess,
    onFinally,
  }: CreateLiquidityPoolProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createLiquidityPool(token.value, liquidityPool)
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

type UpdateLiquidityPoolProps = {
  liquidityPool_id: string;
  liquidityPool: UpdateLiquidityPool;
};
export const useUpdateLiquidityPool = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    liquidityPool_id,
    liquidityPool,
    onError,
    onSuccess,
    onFinally,
  }: UpdateLiquidityPoolProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await updateLiquidityPool(token.value, liquidityPool_id, liquidityPool)
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

type DeleteLiquidityPoolProps = {
  liquidityPool_id: string;
};
export const useDeleteLiquidityPool = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    liquidityPool_id,
    onError,
    onSuccess,
    onFinally,
  }: DeleteLiquidityPoolProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await deleteLiquidityPool(token.value, liquidityPool_id)
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

type ApproveLiquidityPoolDocumentProps = {
  liquidityPool_id: string;
};
export const useApproveLiquidityPoolDocument = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    liquidityPool_id,
    onError,
    onSuccess,
    onFinally,
  }: ApproveLiquidityPoolDocumentProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await approveLiquidityPoolDocument(token.value, liquidityPool_id)
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

type UploadLiquidityPoolDocumentProps = {
  liquidityPool_id: string;
  document: File;
};
export const useUploadLiquidityPoolDocument = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    liquidityPool_id,
    document,
    onError,
    onSuccess,
    onFinally,
  }: UploadLiquidityPoolDocumentProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await uploadLiquidityPoolDocument(token.value, liquidityPool_id, {
        document,
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
