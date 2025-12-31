"use server";

import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { defaultToken, Token } from "@/types/front/globals";
import { GetTicketsFilters, Ticket, TicketMessage } from "@/types/front/ticket";
import { cookies } from "next/headers";

const api = routes();

export const getTickets = async (
  filters?: GetTicketsFilters
): Promise<Ticket[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return apiFetch(api["ticket"], { token, params: filters });
};

export const getTicketMessages = async (
  id: string
): Promise<TicketMessage[]> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const parsedToken = tokenCookie
    ? (JSON.parse(tokenCookie.value) as Token)
    : null;
  const token: Token = parsedToken || defaultToken;

  return apiFetch(api["ticket"] + `/${id}/message`, { token });
};
