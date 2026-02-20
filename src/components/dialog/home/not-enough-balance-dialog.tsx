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
} from "@/components/ui/alert-dialog";
import { Button } from "../../ui/button";
import { useRouter } from "@/i18n/navigation";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}
export default function NotEnoughBalanceDialog({ open, setOpen }: Props) {
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={(value) => setOpen(value)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Not enough balance!</AlertDialogTitle>
          <AlertDialogDescription>
            You {"don't"} have enough balance of this currency. You need to deposit
            through the wallet page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="">Cancel</AlertDialogCancel>
          <AlertDialogAction color="success" asChild>
            <Button
              className="text-foreground"
              onClick={() => {
                router.push("/wallet");
              }}
            >
              Go To Wallet
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
