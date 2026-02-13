import { useCheckTokenExpiration } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/front/stores/auth";
import { FetchProps } from "@/types/front/globals";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import {
  updateTicketStatus,
  createTicketMessage,
  createTicket,
  getTickets,
} from "./api";
import { TicketStatus } from "@/generated/prisma";
import { Ticket } from "@/types/front/ticket";
import { toast } from "sonner";

type UpdateTicketStatusProps = {
  ticket_id: string;
  ticket_status: TicketStatus;
};

type CreateTicketMessageProps = {
  formData: FormData;
};

type CreateTicketProps = {
  ticket: Partial<Ticket>;
};

export const useUpdateTicketStatus = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    ticket_id,
    ticket_status,
    onError,
    onSuccess,
    onFinally,
  }: UpdateTicketStatusProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await updateTicketStatus(token, ticket_id, ticket_status)
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

export const useCreateTicketMessage = () => {
  const t = useTranslations("ApiErrors");
  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    formData,
    onError,
    onSuccess,
    onFinally,
  }: CreateTicketMessageProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createTicketMessage(token, formData)
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

export const useCreateTicket = () => {
  const t = useTranslations("ApiErrors");
  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = ({
    ticket,
    onError,
    onSuccess,
    onFinally,
  }: CreateTicketProps & FetchProps) => {
    checkTokenExpiration(async () => {
      await createTicket(token, ticket)
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

export const useGetTickets = () => {
  const t = useTranslations("ApiErrors");
  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = useCallback(
    ({ onError, onSuccess, onFinally }: FetchProps) => {
      checkTokenExpiration(async () => {
        await getTickets(token)
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
    },
    [checkTokenExpiration, t, token]
  );
  return fetch;
};
