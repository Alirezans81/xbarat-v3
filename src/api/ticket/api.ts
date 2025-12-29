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

export const createTicketMessage = (token: Token, formData: FormData) => {
  const ticketId = formData.get("ticketId");
  return apiFetch<TicketMessage>(api["ticket"] + "/" + ticketId + "/message/", {
    method: "POST",
    token,
    body: formData,
  });
};

export const createTicket = (token: Token, ticket: Partial<Ticket>) => {
  return apiFetch<Ticket>(api["ticket"], {
    method: "POST",
    token,
    body: ticket,
  });
};

export const getTickets = (token: Token) => {
  return apiFetch<Ticket[]>(api["ticket"], { method: "GET", token });
};
