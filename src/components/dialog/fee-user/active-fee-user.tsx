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
import { useActiveFeeUser } from "@/api/fee-user/hook";

interface Props {
  feeUser_id: string;
}
export default function ActiveFeeUserDialog({ feeUser_id }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeFeeUser = useActiveFeeUser();

  const handleSumbit = () => {
    setLoading(true);
    activeFeeUser({
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
        <Button className="ms-2 ">Active</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will activate the fee user. And deactivate others.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="">Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="text-foreground"
              onClick={handleSumbit}
              disabled={loading}
            >
              Activate
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
