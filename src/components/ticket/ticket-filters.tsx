"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketStatus } from "@/generated/prisma";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";

interface Props {
  default_ticket_status?: TicketStatus;
}
export default function TicketFilters({ default_ticket_status }: Props) {
  const [status, setStatus] = useState<TicketStatus | undefined>(
    default_ticket_status
  );

  const router = useRouter();
  useEffect(() => {
    if (status) {
      router.push(`/panel-admin/ticket?status=${status}`);
    }
  }, [status]);

  return (
    <div className="flex gap-2">
      <Select
        value={status}
        onValueChange={(value: TicketStatus) => {
          setStatus(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"OPEN" as TicketStatus}>Open</SelectItem>
          <SelectItem value={"CLOSED" as TicketStatus}>Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
