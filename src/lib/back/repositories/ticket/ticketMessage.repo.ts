import { prisma } from "../../prisma";
import { CreateTicketMessage } from "@/types/back/ticket";

export const ticketMessageRepository = {
  create: async (data: CreateTicketMessage) => {
    return prisma.ticketMessage.create({
      data,
    });
  },

  getByTicketId: async (ticketId: string) => {
    return prisma.ticketMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
    });
  },
};
