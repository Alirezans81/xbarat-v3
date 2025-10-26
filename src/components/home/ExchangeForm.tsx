"use client";

import { Currency } from "@/types/front/currency";
import { CurrencyPair } from "@/types/front/currencyPair";
import { Wallet } from "@/types/front/wallet";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuthStore } from "@/lib/front/stores/auth";
import { useLoginSignupDialogStore } from "@/lib/front/stores/dialog";
import { useCurrentTime } from "@/hooks/use-time";
import { useEffect, useState } from "react";
import { useGetWallets } from "@/api/wallet/hook";
import { useCreateExchange } from "@/api/wallet/exchange/hooks";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

interface Props {
  currencies: Currency[];
  currencyPairs: CurrencyPair[];
  wallets: Wallet[];
}
export default function ExchangeForm({
  currencies,
  currencyPairs,
  wallets: outerWallet,
}: Props) {
  const { isLoggedIn, token } = useAuthStore();
  const { setOpen: setLoginSignupDialogOpen } = useLoginSignupDialogStore();
  const currentTime = useCurrentTime();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [wallets, setWallets] = useState<Wallet[]>(outerWallet);
  const getWallets = useGetWallets();
  useEffect(() => {
    token &&
      getWallets({
        setWallets,
      });
  }, [token]);
  useEffect(() => {
    !isLoggedIn && setWallets([]);
  }, [isLoggedIn]);

  const [sources, setSources] = useState<Currency[]>([]);
  const [targets, setTargets] = useState<Currency[]>([]);

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    setSources(currencies);
  }, [currencies]);

  useEffect(() => {
    setTargets(sources.filter((e) => e.id !== selectedSourceId));
    setSelectedPair(null);

    const foundWallet = wallets.find((e) => e.currencyId === selectedSourceId);
    foundWallet ? setSelectedWallet(foundWallet) : setSelectedWallet(null);
  }, [sources, selectedSourceId, wallets]);

  useEffect(() => {
    if (selectedSourceId && selectedTargetId) {
      const pair = currencyPairs.find(
        (e) =>
          e.fromCurrencyId === selectedSourceId &&
          e.toCurrencyId === selectedTargetId
      );
      setSelectedPair(pair || null);
      pair && setRate(pair.rate + "");
    }
  }, [selectedTargetId]);

  const [isSwitching, setIsSwitching] = useState(false);
  const switchCurrencies = () => {
    setIsSwitching(true);
    const temp = selectedSourceId;
    setSelectedSourceId(selectedTargetId);
    setSelectedTargetId(temp);
  };
  useEffect(() => {
    if (isSwitching) setIsSwitching(false);
  }, [isSwitching, selectedTargetId]);

  const createExchange = useCreateExchange();
  const handleSubmit = () => {
    if (!isLoggedIn) {
      setLoginSignupDialogOpen(true);
    } else {
      if (selectedWallet && +selectedWallet.balance < +amount) {
        toast.error("Insufficient balance");
        router.push(
          `/wallet/deposit?new_deposit_wallet=${selectedWallet.id}&new_deposit_amount=${amount}`
        );
        return;
      }
      if (selectedPair) {
        setLoading(true);
        createExchange({
          exchange: {
            currencyPairId: selectedPair.id,
            fromAmount: +amount,
            remainingAmount: +amount,
            exchangeRate: +rate,
            toAmount: !selectedPair.isInverseRate
              ? +amount * +rate
              : +amount / +rate,
          },
          onSuccess() {
            router.push(`/wallet/exchange`);
          },
          onFinally() {
            setLoading(false);
          },
        });
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute w-full flex flex-col">
        <div className="w-fit ml-8.5 flex flex-col items-center bg-primary px-4 py-2 rounded-t-xl -z-10">
          <span className="text-sm">Balance</span>

          <span className="font-bold text-2xl">
            {selectedWallet ? (+selectedWallet.balance).toLocaleString() : ""}
          </span>
        </div>
      </div>

      <form
        className={`bg-card dark:bg-accent px-6 py-5 rounded-xl flex flex-col items-center gap-4 transition-all duration-500 shadow-xl ease-in-out ${
          selectedWallet ? "translate-y-16" : ""
        }`}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="w-full flex gap-4">
          <div className="flex-1 flex">
            <Select
              value={selectedSourceId}
              onValueChange={(value) => {
                setSelectedSourceId(value);
                if (!isSwitching) {
                  setSelectedTargetId("");
                  setAmount("");
                  setRate("");
                }
              }}
              required
            >
              <SelectTrigger className="w-[7rem] rounded-e-none lg:text-lg lg:py-5">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="flex-1 rounded-s-none lg:!text-lg lg:py-5"
              type="number"
              inputMode="decimal"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
              required
            />
          </div>
          <button
            className="cursor-pointer"
            type="button"
            onClick={switchCurrencies}
          >
            <ArrowRightLeft className="text-primary" />
          </button>
          <div className="flex-1 flex">
            <Select
              value={selectedTargetId}
              onValueChange={(value) => {
                if (!isSwitching) {
                  setSelectedTargetId(value);
                  setAmount("1");
                  setRate((+(selectedPair?.rate || "")).toLocaleString());
                }
              }}
              required
            >
              <SelectTrigger className="w-[7rem] rounded-e-none lg:text-lg lg:py-5">
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                {targets.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="flex-1 rounded-s-none lg:!text-lg lg:py-5"
              type="number"
              inputMode="decimal"
              placeholder="Rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="w-full flex justify-between items-end">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span>
                {sources.find((e) => e.id === selectedSourceId)?.symbol}{" "}
                {(+(amount || "0")).toLocaleString()}
              </span>
              <span>=</span>
              <span>
                {targets.find((e) => e.id === selectedTargetId)?.symbol}{" "}
                <span className="text-secondary">
                  {(!selectedPair?.isInverseRate
                    ? +amount.replaceAll(",", "") * +rate.replaceAll(",", "")
                    : (
                        +amount.replaceAll(",", "") / +rate.replaceAll(",", "")
                      ).toFixed(
                        targets.find((e) => e.id === selectedTargetId)?.decimals
                      )
                  ).toLocaleString()}
                </span>
              </span>
            </div>
            {selectedSourceId && selectedTargetId ? (
              <div className="text-muted-foreground">
                Mid-market exchange rate at{" "}
                <span className="text-foreground">
                  {currentTime.toLocaleTimeString()}
                </span>{" "}
                is{" "}
                <button
                  className="text-secondary cursor-pointer"
                  type="button"
                  onClick={() =>
                    selectedPair && setRate(selectedPair?.rate + "")
                  }
                >
                  {(+(selectedPair?.rate || "")).toLocaleString()}
                </button>
              </div>
            ) : (
              <div>
                <span className="text-muted-foreground">
                  Select <span className="text-foreground">source</span> and{" "}
                  <span className="text-foreground">target</span> currencies to
                  see the{" "}
                  <span className="text-secondary">mid-market rate.</span>
                </span>
              </div>
            )}
          </div>
          <Button size={"lg"} type="submit" className="text-lg">
            {loading ? "Loading..." : "Exchange"}
          </Button>
        </div>
        <Link
          href="#tables"
          className="text-muted-foreground -mb-2 mt-2 transition-all duration-300 hover:text-foreground cursor-pointer w-fit"
        >
          See the tables.
        </Link>
      </form>
    </div>
  );
}
