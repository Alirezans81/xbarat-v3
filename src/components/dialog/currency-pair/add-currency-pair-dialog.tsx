"use client";

import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useCreateCurrency, useGetCurrencies } from "@/api/currency/hook";
import { useRouter } from "@/i18n/navigation";
import { PaymentChannel } from "@/types/front/paymentChannel";
import { useGetPaymentChannels } from "@/api/payment-channel/hook";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Currency } from "@/types/front/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCurrencyPair } from "@/api/currency-pair/hook";

interface Props {}
export default function AddCurrencyPairDialog({}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCurrencies = useGetCurrencies();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  useEffect(() => {
    getCurrencies({
      setCurrencies,
    });
  }, []);

  const [fromCurrencyId, setFromCurrencyId] = useState("");
  const [fromCurrencyIdError, setFromCurrencyIdError] = useState("");
  const validateFromCurrencyId = (value: string) => {
    if (!value) {
      setFromCurrencyIdError("From Currency required!");
      return false;
    }

    return true;
  };

  const [toCurrencyId, setToCurrencyId] = useState("");
  const [toCurrencyIdError, setToCurrencyIdError] = useState("");
  const validateToCurrencyId = (value: string) => {
    if (!value) {
      setToCurrencyIdError("To Currency required!");
      return false;
    }

    return true;
  };

  const [rate, setRate] = useState(0);
  const [rateError, setRateError] = useState("");
  const validateRate = (value: number) => {
    if (!value) {
      setRateError("Rate required!");
      return false;
    }

    return true;
  };

  const [feePercentage, setFeePercentage] = useState(0);
  const [feePercentageError, setFeePercentageError] = useState("");
  const validateFeePercentage = (value: number) => {
    if (!value) {
      setFeePercentageError("Fee Percentage required!");
      return false;
    }

    if (value < 0 || value > 100) {
      setFeePercentageError("Fee Percentage must be between 0 and 100!");
      return false;
    }

    return true;
  };

  const [isInverseRate, setIsInverseRate] = useState(false);

  const [isActive, setIsActive] = useState(true);

  const createCurrencyPair = useCreateCurrencyPair();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      validateFromCurrencyId(fromCurrencyId) &&
      validateToCurrencyId(toCurrencyId) &&
      validateRate(rate)
    ) {
      setLoading(true);
      createCurrencyPair({
        currencyPair: {
          fromCurrencyId,
          toCurrencyId,
          rate,
          feePercentage,
          isInverseRate,
          isActive,
        },
        onSuccess() {
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
          <DialogTitle className="">Add Currency Pair</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Select
              value={fromCurrencyId}
              onValueChange={(value) => {
                validateFromCurrencyId(value);
                setFromCurrencyId(value);
                setToCurrencyId("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fromCurrencyIdError && (
              <span className="block text-sm mt-2 text-chart-5">
                {fromCurrencyIdError}
              </span>
            )}
          </div>
          <div>
            <Select
              value={toCurrencyId}
              onValueChange={(value) => {
                validateToCurrencyId(value);
                setToCurrencyId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                {currencies
                  .filter((e) => e.id !== fromCurrencyId)
                  .map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.code}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {toCurrencyIdError && (
              <span className="block text-sm mt-2 text-chart-5">
                {toCurrencyIdError}
              </span>
            )}
          </div>
          <div>
            <Input
              placeholder="Rate"
              type="number"
              inputMode="numeric"
              value={rate}
              onChange={(e) => setRate(+e.target.value)}
              onBlur={(e) => validateRate(+e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Input
              placeholder="Fee Percentage"
              type="number"
              inputMode="numeric"
              value={feePercentage}
              onChange={(e) => setFeePercentage(+e.target.value)}
              onBlur={(e) => validateFeePercentage(+e.target.value)}
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              %
            </span>
          </div>
          <div>
            <div className="flex flex-col gap-4 bg-card p-3 rounded-md">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isInverseRate}
                    onCheckedChange={() => {
                      setIsInverseRate((prev) => !prev);
                    }}
                  />
                  <Label>Invert Rate</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={() => {
                      setIsActive((prev) => !prev);
                    }}
                  />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
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
