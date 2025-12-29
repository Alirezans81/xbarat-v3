import routes from "@/api/routes";
import { TicketStatus } from "@/generated/prisma";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Token } from "@/types/front/globals";
import { Ticket } from "@/types/front/ticket";
import { TicketMessage } from "@/types/front/ticket";
const api = routes();

export const updateTicketStatus = (
  token: Token,
  ticket_id: string,
  ticket_status: TicketStatus
) => {
  return apiFetch<Ticket[]>(api["ticket"] + "/" + ticket_id, {
    method: "PUT",
    token,
    body: {
      status: ticket_status,
    },
  });
};

export const createTicketMessage = (
  token: Token,
  ticket_message: Partial<TicketMessage>
) => {
  return apiFetch<TicketMessage>(
    api["ticket"] + "/" + ticket_message.ticketId + "/message/",
    {
      method: "POST",
      token,
      body: ticket_message,
    }
  );
};

export const createTicket = (token: Token, ticket: Partial<Ticket>) => {
  return apiFetch<Ticket>(api["ticket"], {
    method: "POST",
    token,
    body: ticket,
  });
};
