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
import { useCreateCurrency, useUpdateCurrency } from "@/api/currency/hook";
import { useRouter } from "@/i18n/navigation";
import { Currency } from "@/types/front/currency";
import { useGetPaymentChannels } from "@/api/payment-channel/hook";
import { PaymentChannel } from "@/types/front/paymentChannel";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  data: Currency;
}
export default function EditCurrencyDialog({ data }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(data.name);
  const [NameError, setNameError] = useState("");
  const validateName = (value: string) => {
    if (!value) {
      setNameError("Name required!");
      return false;
    }

    return true;
  };

  const [code, setCode] = useState(data.code);
  const [CodeError, setCodeError] = useState("");
  const validateCode = (value: string) => {
    if (!value) {
      setCodeError("Code required!");
      return false;
    }

    return true;
  };

  const [symbol, setSymbol] = useState(data.symbol);
  const [SymbolError, setSymbolError] = useState("");
  const validateSymbol = (value: string) => {
    if (!value) {
      setSymbolError("Symbol required!");
      return false;
    }

    return true;
  };

  const [decimals, setDecimals] = useState(data.decimals);
  const [DecimalsError, setDecimalsError] = useState("");
  const validateDecimals = (value: string) => {
    if (!value) {
      setDecimalsError("Decimals required!");
      return false;
    }

    return true;
  };

  const [paymentChannels, setPaymentChannels] = useState<PaymentChannel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    data.paymentChannels.map((e) => e.id)
  );
  const getPaymentChannels = useGetPaymentChannels();
  useEffect(() => {
    getPaymentChannels({
      setPaymentChannels,
    });
  }, []);

  const updateCurrency = useUpdateCurrency();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      validateName(name) &&
      validateCode(code) &&
      validateSymbol(symbol) &&
      validateDecimals(decimals + "")
    ) {
      setLoading(true);
      updateCurrency({
        currency_id: data.id,
        currency: {
          name,
          code,
          symbol,
          decimals,
          paymentChannelIds: selectedChannels,
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
          <Button className="text-foreground ">Edit</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="">Add Currency</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => validateName(e.target.value)}
              required
            />
            {NameError && (
              <span className="block text-sm mt-2 text-chart-5">
                {NameError}
              </span>
            )}
          </div>
          <div>
            <Input
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={(e) => validateCode(e.target.value)}
              required
            />
            {CodeError && (
              <span className="block text-sm mt-2 text-chart-5">
                {CodeError}
              </span>
            )}
          </div>
          <div>
            <Input
              placeholder="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onBlur={(e) => validateSymbol(e.target.value)}
              required
            />
            {SymbolError && (
              <span className="block text-sm mt-2 text-chart-5">
                {SymbolError}
              </span>
            )}
          </div>
          <div>
            <Input
              type="number"
              placeholder="Decimals"
              value={decimals}
              onChange={(e) => setDecimals(+e.target.value)}
              onBlur={(e) => validateDecimals(e.target.value)}
              required
            />
            {DecimalsError && (
              <span className="block text-sm mt-2 text-chart-5">
                {DecimalsError}
              </span>
            )}
          </div>
          <div>
            <div className="flex flex-col gap-4 bg-card p-3 border border-input rounded-md">
              <span className="text-muted-foreground text-sm">
                Payment Channels
              </span>
              <div className="flex flex-wrap gap-4">
                {paymentChannels.map((channel) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      key={channel.id}
                      value={channel.id}
                      checked={selectedChannels.includes(channel.id)}
                      onCheckedChange={(value) => {
                        if (value) {
                          setSelectedChannels([
                            ...selectedChannels,
                            channel.id,
                          ]);
                        } else {
                          setSelectedChannels(
                            selectedChannels.filter((id) => id !== channel.id)
                          );
                        }
                      }}
                    />
                    <Label>{channel.name}</Label>
                  </div>
                ))}
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
