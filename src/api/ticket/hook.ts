import { useCheckTokenExpiration } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/front/stores/auth";
import { FetchProps } from "@/types/front/globals";
import { useTranslations } from "next-intl";
import { updateTicketStatus } from "./api";
import { TicketStatus } from "@/generated/prisma";
import { toast } from "sonner";

type UpdateTicketStatusProps = {
  ticket_id: string;
  ticket_status: TicketStatus;
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
