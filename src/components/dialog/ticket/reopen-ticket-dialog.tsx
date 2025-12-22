"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../../ui/button";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useUpdateTicketStatus } from "@/api/ticket/hook";

interface Props {
  ticket_id: string;
}
export default function ReopenTicketDialog({ ticket_id }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateTicketStatus = useUpdateTicketStatus();

  const handleSumbit = () => {
    setLoading(true);
    updateTicketStatus({
      ticket_id,
      ticket_status: "OPEN",
      onSuccess() {
        setOpen(false);
        router.refresh();
      },
      onFinally() {
        setLoading(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={(value) => setOpen(value)}>
      <AlertDialogTrigger>
        <Button className="ms-2 ">Reopen</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action makes the ticket opened again. Though you can close it
            later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="">Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="text-foreground "
              onClick={handleSumbit}
              disabled={loading}
            >
              Reopen
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
