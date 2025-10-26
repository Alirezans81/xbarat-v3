"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useRouter } from "@/i18n/navigation";
import { Currency } from "@/types/front/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLiquidityPool } from "@/api/liquidity-pool/hook";

interface Props {
  currency: Currency;
}
export default function AddLiquidityPoolDialog({ currency }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState("");
  const [AddressError, setAddressError] = useState("");
  const validateAddress = (value: string) => {
    if (!value) {
      setAddressError("Address required!");
      return false;
    }

    return true;
  };

  const paymentChannels = currency.paymentChannels || [];
  const [paymentChannelId, setPaymentChannelId] = useState("");
  const [paymentChannelIdError, setPaymentChannelIdError] = useState("");
  const validatePaymentChannelId = (value: string) => {
    if (!value) {
      setPaymentChannelIdError("Payment Channel required!");
      return false;
    }

    return true;
  };

  const [balance, setBalance] = useState("");
  const [BalanceError, setBalanceError] = useState("");
  const validateBalance = (value: string) => {
    if (!value) {
      setBalanceError("Balance required!");
      return false;
    }

    return true;
  };

  const createLiquidityPool = useCreateLiquidityPool();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      validateAddress(address) &&
      validatePaymentChannelId(paymentChannelId) &&
      validateBalance(balance)
    ) {
      createLiquidityPool({
        liquidityPool: {
          frozen: 0,
          currencyId: currency.id,
          paymentChannelId,
          address,
          balance: parseFloat(balance),
        },
        onSuccess: () => {
          setOpen(false);
          router.refresh();
        },
        onFinally() {
          setLoading(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <div>
          <Button className="text-white">+ Add</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="">Add Currency</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
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
                {paymentChannels.map((channel) => (
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
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={(e) => validateAddress(e.target.value)}
              required
            />
            {AddressError && (
              <span className="block text-sm mt-2 text-chart-5">
                {AddressError}
              </span>
            )}
          </div>
          <div>
            <Input
              type="number"
              placeholder="Balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              onBlur={(e) => validateBalance(e.target.value)}
              required
            />
            {BalanceError && (
              <span className="block text-sm mt-2 text-chart-5">
                {BalanceError}
              </span>
            )}
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
