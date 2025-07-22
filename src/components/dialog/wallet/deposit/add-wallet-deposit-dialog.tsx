"use client";

import { useState } from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { useRouter } from "@/i18n/navigation";
import { Wallet } from "@/types/front/wallet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateDeposit } from "@/api/wallet/deposit/hook";

interface Props {
  currency: Wallet["currency"];
  walletId: string;
}
export default function AddWalletDepositDialog({ currency, walletId }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState("");
  const [AmountError, setAmountError] = useState("");
  const validateAmount = (value: string) => {
    if (!value) {
      setAmountError("Amount required!");
      return false;
    }

    return true;
  };

  const [paymentChannelId, setPaymentChannelId] = useState("");
  const [paymentChannelIdError, setPaymentChannelIdError] = useState("");
  const validatePaymentChannelId = (value: string) => {
    if (!value) {
      setPaymentChannelIdError("Payment channel required!");
      return false;
    }
    setAmountError("");
    return true;
  };

  const createDeposit = useCreateDeposit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    createDeposit({
      deposit: {
        amount: +amount,
        walletId,
        paymentChannelId,
      },
      onSuccess() {
        setOpen(false);
        router.push("/wallet/deposit");
      },
      onFinally() {
        setLoading(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <div>
          <Button
            variant="ghost"
            className="text-foreground  bg-[#369635] hover:!bg-[#369635]"
          >
            New Deposit
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Deposit {"(" + currency.code + ")"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={(e) => validateAmount(e.target.value)}
              required
            />
            {AmountError && (
              <span className="block text-sm mt-2 text-chart-5">
                {AmountError}
              </span>
            )}
          </div>
          <div>
            <Select
              value={paymentChannelId}
              onValueChange={(value) => {
                validatePaymentChannelId(value);
                setPaymentChannelId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment Channel" />
              </SelectTrigger>
              <SelectContent>
                {currency.paymentChannels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {paymentChannelIdError && (
              <span className="block text-sm mt-2 text-chart-5">
                {paymentChannelIdError}
              </span>
            )}
          </div>
          <div className="w-full flex items-center justify-between text-sm">
            <span>Fee:</span>
            <span>{currency.symbol + " 2.25"}</span>
          </div>
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full text-foreground "
              disabled={loading}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
