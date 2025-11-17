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
import { useDeleteFeeUser } from "@/api/fee-user/hook";

interface Props {
  feeUser_id: string;
}
export default function DeleteFeeUserDialog({ feeUser_id }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteFeeUser = useDeleteFeeUser();

  const handleSumbit = () => {
    setLoading(true);
    deleteFeeUser({
      feeUser_id,
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
        <Button variant="destructive" className="ms-2 ">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the fee
            user and remove the data from servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="">Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="text-foreground "
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
