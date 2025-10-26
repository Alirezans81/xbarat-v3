"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateWithdrawal } from "@/api/wallet/withdrawal/hook";
import { Wallet } from "@/types/front/wallet";
import { useGetWallets } from "@/api/wallet/hook";

interface Props {}
export default function AddWithdrawalDialog({}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [walletId, setWalletId] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const getWallets = useGetWallets();
  useEffect(() => {
    getWallets({
      setWallets,
    });
  }, []);
  const [WalletIdError, setWalletIdError] = useState("");
  const validateWalletId = (value: string) => {
    if (!value) {
      setWalletIdError("Currency required!");
      return false;
    }

    return true;
  };

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
      setPaymentChannelIdError("Payment Channel required!");
      return false;
    }
    setAmountError("");
    return true;
  };

  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverAddressError, setReceiverAddressError] = useState("");
  const validateReceiverAddress = (value: string) => {
    if (!value) {
      setReceiverAddressError("Receiver address required!");
      return false;
    }
    setReceiverAddressError("");
    return true;
  };

  const [addressOwnerName, setAddressOwnerName] = useState("");
  const [addressOwnerNameError, setAddressOwnerNameError] = useState("");
  const validateAddressOwnerName = (value: string) => {
    if (!value) {
      setAddressOwnerNameError("Address owner name required!");
      return false;
    }
    setAddressOwnerNameError("");
    return true;
  };

  const findWallet = (): Wallet | null => {
    return wallets.find((e) => e.id === walletId) || null;
  };

  const createWithdrawal = useCreateWithdrawal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    createWithdrawal({
      withdrawal: {
        amount: +amount,
        walletId,
        paymentChannelId,
        receiverAddress,
        addressOwnerName,
      },
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
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <div>
          <Button variant="destructive">+ New</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Withdrawal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Select
              value={walletId}
              onValueChange={(value) => {
                validateWalletId(value);
                setWalletId(value);
                setPaymentChannelId("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.currency.code + " (" + wallet.currency.symbol + ")"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {WalletIdError && (
              <span className="block text-sm mt-2 text-chart-5">
                {WalletIdError}
              </span>
            )}
          </div>
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
                {findWallet()?.currency.paymentChannels.map((channel) => (
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
          <div>
            <Input
              placeholder="Receiver Address"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              onBlur={(e) => validateReceiverAddress(e.target.value)}
              required
            />
            {receiverAddressError && (
              <span className="block text-sm mt-2 text-chart-5">
                {receiverAddressError}
              </span>
            )}
          </div>
          <div>
            <Input
              placeholder="Address Owner Name"
              value={addressOwnerName}
              onChange={(e) => setAddressOwnerName(e.target.value)}
              onBlur={(e) => validateAddressOwnerName(e.target.value)}
              required
            />
            {addressOwnerNameError && (
              <span className="block text-sm mt-2 text-chart-5">
                {addressOwnerNameError}
              </span>
            )}
          </div>
          {/* <div className="w-full flex items-center justify-between text-sm">
            <span>Fee:</span>
            <span>{findWallet()?.currency.symbol + " 2.25"}</span>
          </div> */}
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
