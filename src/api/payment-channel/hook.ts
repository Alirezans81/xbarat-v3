import { FetchProps } from "@/types/front/globals";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import {
  getPaymentChannels,
  createPaymentChannel,
  updatePaymentChannel,
  deletePaymentChannel,
} from "./api";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import {
  CreatePaymentChannel,
  UpdatePaymentChannel,
  GetPaymentChannelsFilters,
  PaymentChannel,
} from "@/types/front/paymentChannel";

type GetPaymentChannelsProps = {
  setPaymentChannels: (value: PaymentChannel[]) => void;
  filters?: GetPaymentChannelsFilters;
};
export const useGetPaymentChannels = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    setPaymentChannels,
    filters,
    onError,
    onSuccess,
    onFinally,
  }: GetPaymentChannelsProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await getPaymentChannels(token, filters)
        .then((res) => {
          setPaymentChannels(res);
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

type CreatePaymentChannelProps = {
  paymentChannel: CreatePaymentChannel;
};
export const useCreatePaymentChannel = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    paymentChannel,
    onError,
    onSuccess,
    onFinally,
  }: CreatePaymentChannelProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createPaymentChannel(token, paymentChannel)
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

type UpdatePaymentChannelProps = {
  paymentChannel_id: string;
  paymentChannel: UpdatePaymentChannel;
};
export const useUpdatePaymentChannel = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    paymentChannel_id,
    paymentChannel,
    onError,
    onSuccess,
    onFinally,
  }: UpdatePaymentChannelProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await updatePaymentChannel(token, paymentChannel_id, paymentChannel)
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

type DeletePaymentChannelProps = {
  paymentChannel_id: string;
};
export const useDeletePaymentChannel = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    paymentChannel_id,
    onError,
    onSuccess,
    onFinally,
  }: DeletePaymentChannelProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await deletePaymentChannel(token, paymentChannel_id)
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
