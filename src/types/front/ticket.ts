import {
  Ticket as DatabaseTicket,
  TicketMessage as DatabaseTicketMessage,
  UserRole,
  TicketStatus,
  User,
} from "@/generated/prisma";

export type Ticket = Omit<DatabaseTicket, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
  user: Pick<User, "email" | "fullName">;
};

export type TicketMessage = Omit<DatabaseTicketMessage, "createdAt"> & {
  createdAt: string;
};

export type GetTicketsFilters = {
  userId?: string;
  status?: TicketStatus;
};

export type CreateTicket = {
  userId: string;
  subject: string;
};

export type CreateTicketMessage = {
  ticketId: string;
  message: string;
  filesUrl?: string[];
  senderRole?: UserRole;
};
