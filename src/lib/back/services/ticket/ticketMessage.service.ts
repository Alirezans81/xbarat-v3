import { CreateTicketMessage } from "@/types/back/ticket";
import { ticketMessageRepository } from "../../repositories/ticket/ticketMessage.repo";
import { ticketRepository } from "../../repositories/ticket.repo";

export const ticketMessageService = {
  create: async (data: CreateTicketMessage) => {
    const message = await ticketMessageRepository.create(data);

    // unread فقط برای طرف مقابل
    if (data.senderRole !== "SUPPORT" && data.senderRole !== "ADMIN") {
      await ticketRepository.incrementUnread(data.ticketId);
    }

    return message;
  },

  getByTicketId: ticketMessageRepository.getByTicketId,
};
