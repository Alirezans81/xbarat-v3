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
import { Button } from "../../../ui/button";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useDeleteDeposit } from "@/api/wallet/deposit/hook";

interface Props {
  deposit_id: string;
}
export default function DeleteDepositDialog({ deposit_id }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteDeposit = useDeleteDeposit();

  const handleSumbit = () => {
    setLoading(true);
    deleteDeposit({
      deposit_id,
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
        <Button variant="destructive" className="cursor-pointer">
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            deposit request and remove the data from servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="text-foreground cursor-pointer"
              onClick={handleSumbit}
              disabled={loading}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
