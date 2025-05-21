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
import { useDeleteCurrency } from "@/api/currency/hook";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface Props {
  currency_id: string;
}
export default function DeleteCurrencyDialog({ currency_id }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteCurrency = useDeleteCurrency();

  const handleSumbit = () => {
    setLoading(true);
    deleteCurrency({
      currency_id,
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
        <Button variant="destructive" className="ms-2 cursor-pointer">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            currency and remove the data from servers.
          </AlertDialogDescription>
          <AlertDialogDescription className="text-destructive">
            This also cause deleting all users' wallets, connected to the currency.
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
