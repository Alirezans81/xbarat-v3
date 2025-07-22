import { FetchProps } from "@/types/globals";
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
} from "@/types/paymentChannel";

type GetPaymentChannelsProps = {
  setPaymentChannels: (value: PaymentChannel[]) => void;
  filters?: GetPaymentChannelsFilters;
};
export const useGetPaymentChannels = () => {
  7;
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
      await getPaymentChannels(token.value, filters)
        .then((res) => {
          setPaymentChannels(res.data);
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
      await createPaymentChannel(token.value, paymentChannel)
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
      await updatePaymentChannel(token.value, paymentChannel_id, paymentChannel)
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
      await deletePaymentChannel(token.value, paymentChannel_id)
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
