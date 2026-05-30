"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useState } from "react";
import { useCreateAdminTicket } from "@/api/ticket/hook";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { MessageCirclePlus } from "lucide-react";
import { Ticket } from "@/types/front/ticket";

interface Props {
  userEmail: string;
  userName?: string;
  trigger?: React.ReactNode;
}

export default function QuickTicketDialog({
  userEmail,
  userName,
  trigger,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");

  const createAdminTicket = useCreateAdminTicket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    createAdminTicket({
      ticket: {
        email: userEmail,
        subject,
      },
      onSuccess(data) {
        setOpen(false);
        setSubject("");
        router.push(`/panel-admin/ticket/${(data as Ticket).id}/chat`);
      },
      onFinally() {
        setLoading(false);
      },
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSubject("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageCirclePlus className="size-3.5" />
            Ticket
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Ticket for {userName || "User"}</DialogTitle>
          <DialogDescription>
            Open a ticket to communicate with this user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                disabled
                readOnly
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Ticket subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
