import { ticketRepository } from "../repositories/ticket.repo";

export const ticketService = {
  create: ticketRepository.create,
  getAll: ticketRepository.getAll,
  getById: ticketRepository.findById,

  close: (id: string) => ticketRepository.updateStatus(id, "CLOSED"),

  reopen: (id: string) => ticketRepository.updateStatus(id, "OPEN"),

  markAsRead: (id: string) => ticketRepository.resetUnread(id),
};
