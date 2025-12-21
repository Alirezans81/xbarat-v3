import { prisma } from "../prisma";
import { GetTicketsFilters } from "@/types/back/ticket";

export const ticketRepository = {
  create: async (data: { userId: string; subject: string }) => {
    return prisma.ticket.create({
      data,
    });
  },

  getAll: async (filters?: GetTicketsFilters) => {
    return prisma.ticket.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: { updatedAt: "desc" },
      include: { messages: true },
    });
  },

  findById: async (id: string) => {
    return prisma.ticket.findUnique({
      where: { id },
      include: { messages: true },
    });
  },

  updateStatus: async (id: string, status: "OPEN" | "CLOSED") => {
    return prisma.ticket.update({
      where: { id },
      data: { status },
    });
  },

  incrementUnread: async (id: string) => {
    return prisma.ticket.update({
      where: { id },
      data: { unreadCount: { increment: 1 } },
    });
  },

  resetUnread: async (id: string) => {
    return prisma.ticket.update({
      where: { id },
      data: { unreadCount: 0 },
    });
  },
};
