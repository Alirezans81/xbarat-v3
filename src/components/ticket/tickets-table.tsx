import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ticket } from "@/types/front/ticket";
import CloseTicketDialog from "../dialog/ticket/close-ticket-dialog";
import ReopenTicketDialog from "../dialog/ticket/reopen-ticket-dialog";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";

interface Props {
  data: Ticket[];
}
export default function TicketsTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>List of fee tickets.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User Email</TableHead>
          <TableHead>User Fullname</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Last Message</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.user.email}</TableCell>
            <TableCell>{ticket.user.fullName}</TableCell>
            <TableCell>{ticket.subject}</TableCell>
            <TableCell>{ticket.updatedAt}</TableCell>
            <TableCell className="line-clamp-1">
              {ticket.messages?.[-1]?.message}
            </TableCell>
            <TableCell>{ticket.status}</TableCell>
            <TableCell className="flex justify-end">
              <Link href={`/panel-admin/ticket/${ticket.id}/chat`}>
                <Button>Messages</Button>
              </Link>
              {ticket.status !== "CLOSED" && (
                <CloseTicketDialog ticket_id={ticket.id} />
              )}
              {ticket.status !== "OPEN" && (
                <ReopenTicketDialog ticket_id={ticket.id} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
