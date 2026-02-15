"use client";

import { useCreateExchange } from "@/api/wallet/exchange/hooks";
import NotEnoughBalanceDialog from "@/components/dialog/home/not-enough-balance-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useBreakpointValue } from "@/hooks/use-breakpoint";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/lib/front/stores/auth";
import { useLoginSignupDialogStore } from "@/lib/front/stores/dialog";
import { addComma, roundDown } from "@/lib/front/utils/number";
import { Currency } from "@/types/front/currency";
import { CurrencyPair } from "@/types/front/currencyPair";
import { Wallet } from "@/types/front/wallet";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface Props {
  rate: number | undefined;
  setRate: (numRate: number | undefined) => void;
  currencies: Currency[];
  currencyPairs: CurrencyPair[];
  wallets: Wallet[];
  selectedPair: CurrencyPair | null;
  setSelectedPair: (pair: CurrencyPair | null) => void;
}
export default function ExchangeForm({
  rate,
  setRate,
  currencies,
  currencyPairs,
  wallets,
  selectedPair,
  setSelectedPair,
}: Props) {
  const { isLoggedIn } = useAuthStore();
  const { setOpen: setLoginSignupDialogOpen } = useLoginSignupDialogStore();

  const [notEnoughBalanceDialog, setNotEnoughBalanceDialog] = useState(false);

  const [draftSourceId, setDraftSourceId] = useState(
    selectedPair?.fromCurrency.id ?? "",
  );
  const [sourcesPopoverOpen, setSourcesPopoverOpen] = useState(false);

  const [draftTargetId, setDraftTargetId] = useState(
    selectedPair?.toCurrency.id ?? "",
  );
  const [targetsPopoverOpen, setTargetsPopoverOpen] = useState(false);

  const selectedSourceId = selectedPair?.fromCurrency.id ?? draftSourceId;
  const selectedTargetId = selectedPair?.toCurrency.id ?? draftTargetId;

  const selectedSource = currencies.find((e) => e.id === selectedSourceId);
  const selectedTarget = currencies.find((e) => e.id === selectedTargetId);
  const foundWallet = wallets.find((e) => e.currencyId === selectedSourceId);

  const [amount, setAmount] = useState<number>();
  const [lastEdited, setLastEdited] = useState<"source" | "target">("source");

  const SPLIT_INDEX = useBreakpointValue({ base: 2, sm: 3, md: 4, xl: 5 });

  const syncSelectedPair = (nextSourceId: string, nextTargetId: string) => {
    if (nextSourceId && nextTargetId) {
      const foundCurrencyPair = currencyPairs.find(
        (e) =>
          e.fromCurrencyId === nextSourceId && e.toCurrencyId === nextTargetId,
      );

      if (foundCurrencyPair) {
        setSelectedPair(foundCurrencyPair);
        return;
      }
    }

    setSelectedPair(null);
  };

  const { sourceAmount, targetAmount, fee } = useMemo(() => {
    if (!selectedPair || !rate || !amount) {
      return {
        sourceAmount: lastEdited === "source" ? amount : undefined,
        targetAmount: lastEdited === "target" ? amount : undefined,
        fee: 0,
      };
    }

    const feePercentage = +selectedPair.feePercentage / 100;

    if (lastEdited === "source") {
      const computedFee = amount * feePercentage;
      const netSourceAmount = Math.max(amount - computedFee, 0);
      const computedTarget = !selectedPair.isInverseRate
        ? netSourceAmount * rate
        : selectedTarget
          ? roundDown(netSourceAmount / rate, selectedTarget.decimals)
          : undefined;
      return {
        sourceAmount: amount,
        targetAmount: computedTarget,
        fee: computedFee,
      };
    }

    const netSourceAmount = !selectedPair.isInverseRate
      ? selectedSource
        ? roundDown(amount / rate, selectedSource.decimals)
        : undefined
      : amount * rate;
    const sourceAmountWithFee =
      netSourceAmount && feePercentage < 1
        ? netSourceAmount / (1 - feePercentage)
        : undefined;
    const computedFee = sourceAmountWithFee
      ? sourceAmountWithFee * feePercentage
      : 0;

    return {
      sourceAmount: sourceAmountWithFee,
      targetAmount: amount,
      fee: computedFee,
    };
  }, [amount, lastEdited, rate, selectedPair, selectedSource, selectedTarget]);

  const handleSourceAmountChange = (newSourceAmount: number) => {
    setLastEdited("source");
    setAmount(newSourceAmount);
  };

  const handleTargetAmountChange = (newTargetAmount: number) => {
    setLastEdited("target");
    setAmount(newTargetAmount);
  };

  const handleSwitch = () => {
    const oldSourceId = selectedSourceId;
    setDraftSourceId(selectedTargetId);
    setDraftTargetId(oldSourceId);
    syncSelectedPair(selectedTargetId, oldSourceId);
    if (lastEdited === "source") {
      setAmount(targetAmount);
    } else {
      setAmount(sourceAmount);
    }
  };

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const createExchange = useCreateExchange();
  const handleSubmit = () => {
    if (selectedPair && sourceAmount && targetAmount && rate) {
      setLoading(true);
      createExchange({
        exchange: {
          currencyPairId: selectedPair.id,
          fromAmount: sourceAmount,
          toAmount: targetAmount,
          exchangeRate: rate,
        },
        onSuccess() {
          toast.success("Your exchange submitted successfully.");
          router.replace("/#latest-table");
        },
        onError() {
          toast.error("Something went wrong.");
        },
        onFinally() {
          setLoading(false);
        },
      });
    }
  };

  return (
    <Card className="w-fit mx-auto">
      <NotEnoughBalanceDialog
        open={notEnoughBalanceDialog}
        setOpen={setNotEnoughBalanceDialog}
      />
      <form
        className="grid grid-cols-11 gap-y-4 px-6 py-2.5"
        onSubmit={(e) => {
          e.preventDefault();

          if (!isLoggedIn) {
            toast.error("First you must log in to your account.");
            setLoginSignupDialogOpen(true);
            return;
          }

          if (sourceAmount) {
            if (!foundWallet?.balance || +foundWallet.balance < sourceAmount) {
              setNotEnoughBalanceDialog(true);
              return;
            }
          }

          handleSubmit();
        }}
      >
        <div className="col-span-5 flex gap-2 overflow-visible">
          <ToggleGroup
            type="single"
            spacing={2}
            value={selectedSourceId}
            onValueChange={(value) => {
              setDraftSourceId(value);
              syncSelectedPair(value, selectedTargetId);
            }}
          >
            {currencies.slice(0, SPLIT_INDEX).map((currency) => (
              <ToggleGroupItem
                key={currency.id}
                variant="outline"
                value={currency.id}
                disabled={selectedTargetId === currency.id}
                className={`w-14 sm:w-16 ${selectedSourceId === currency.id ? "!bg-primary" : "border-muted"} hover:cursor-pointer `}
              >
                {currency.code}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {currencies.length > SPLIT_INDEX && (
            <Popover
              open={sourcesPopoverOpen}
              onOpenChange={(value) => setSourcesPopoverOpen(value)}
            >
              <PopoverTrigger>
                <Button
                  type="button"
                  variant="outline"
                  className="!px-1 !bg-transparent !border-muted"
                >
                  <ChevronDown
                    className={`transition-all duration-150 ${
                      sourcesPopoverOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <ToggleGroup
                  type="single"
                  spacing={2}
                  value={selectedSourceId}
                  onValueChange={(value) => {
                    setDraftSourceId(value);
                    syncSelectedPair(value, selectedTargetId);
                  }}
                  className="grid grid-cols-2"
                >
                  {currencies
                    .slice(SPLIT_INDEX, currencies.length)
                    .map((currency) => (
                      <ToggleGroupItem
                        key={currency.id}
                        variant="outline"
                        value={currency.id}
                        className={`w-14 sm:w-16 ${selectedSourceId === currency.id ? "!bg-primary" : "border-muted"} hover:cursor-pointer col-span-1`}
                        disabled={selectedTargetId === currency.id}
                      >
                        {currency.code}
                      </ToggleGroupItem>
                    ))}
                </ToggleGroup>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="col-span-1 flex flex-col gap-2" />
        <div className="col-span-5 flex gap-2 overflow-visible">
          <ToggleGroup
            type="single"
            spacing={2}
            value={selectedTargetId}
            onValueChange={(value) => {
              setDraftTargetId(value);
              syncSelectedPair(selectedSourceId, value);
            }}
          >
            {currencies.slice(0, SPLIT_INDEX).map((currency) => (
              <ToggleGroupItem
                key={currency.id}
                variant="outline"
                value={currency.id}
                className={`w-14 sm:w-16 ${selectedTargetId === currency.id ? "!bg-primary" : "border-muted"} hover:cursor-pointer `}
                disabled={selectedSourceId === currency.id}
              >
                {currency.code}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {currencies.length > SPLIT_INDEX && (
            <Popover
              open={targetsPopoverOpen}
              onOpenChange={(value) => setTargetsPopoverOpen(value)}
            >
              <PopoverTrigger>
                <Button
                  type="button"
                  variant="outline"
                  className="!px-1 !bg-transparent !border-muted"
                >
                  <ChevronDown
                    className={`transition-all duration-150 ${
                      targetsPopoverOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <ToggleGroup
                  type="single"
                  spacing={2}
                  value={selectedTargetId}
                  onValueChange={(value) => {
                    setDraftTargetId(value);
                    syncSelectedPair(selectedSourceId, value);
                  }}
                  className="grid grid-cols-2"
                >
                  {currencies
                    .slice(SPLIT_INDEX, currencies.length)
                    .map((currency) => (
                      <ToggleGroupItem
                        key={currency.id}
                        variant="outline"
                        value={currency.id}
                        className={`w-14 sm:w-16 ${selectedTargetId === currency.id ? "!bg-primary" : "border-muted"} hover:cursor-pointer col-span-1`}
                        disabled={selectedSourceId === currency.id}
                      >
                        {currency.code}
                      </ToggleGroupItem>
                    ))}
                </ToggleGroup>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="col-span-5 flex flex-col gap-2">
          <InputGroup className="!py-5">
            <InputGroupInput
              placeholder="Source"
              className="md:text-lg"
              type="number"
              inputMode="decimal"
              value={sourceAmount}
              onChange={(e) => handleSourceAmountChange(+e.currentTarget.value)}
            />
            <InputGroupAddon align="inline-end">
              {foundWallet && (
                <Button
                  type="button"
                  variant="ghost"
                  className="-me-1"
                  onClick={() =>
                    handleSourceAmountChange(+foundWallet.balance || 0)
                  }
                >
                  Max
                </Button>
              )}
            </InputGroupAddon>
          </InputGroup>

          {selectedSource && foundWallet && (
            <div className="w-full flex justify-between items-center text-sm">
              <span>
                Balance:{" "}
                <span className="text-secondary">
                  {selectedSource.symbol}
                  {addComma(foundWallet.balance || 0)}
                </span>
                {"  "}
              </span>
              {sourceAmount && (
                <span>
                  Fee:{" "}
                  <span className="text-red">
                    {selectedSource.symbol}
                    {addComma(fee)}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
        <div className="col-span-1 flex flex-col gap-2">
          <Button
            variant="link"
            onClick={handleSwitch}
            className="!py-5 !px-0 opacity-50 hover:opacity-100"
          >
            <Image
              src="/Exchange/switch.svg"
              alt="Exchange"
              width={25}
              height={25}
            />
          </Button>
        </div>
        <div className="col-span-5 flex flex-col gap-2">
          <Input
            placeholder="Target"
            className="md:text-lg !py-5"
            type="number"
            inputMode="decimal"
            value={targetAmount}
            onChange={(e) => handleTargetAmountChange(+e.currentTarget.value)}
          />
        </div>
        <div className="col-span-5 flex flex-col gap-2">
          <Input
            placeholder="Rate"
            className="md:text-lg !py-5"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(+e.currentTarget.value)}
          />
          {selectedPair && (
            <span className="text-sm">
              Current Rate:{" "}
              <button
                type="button"
                className="text-secondary cursor-pointer"
                onClick={() => setRate(+selectedPair.rate)}
              >
                {+selectedPair.rate}
              </button>{" "}
            </span>
          )}
        </div>
        <div className="col-span-1 flex flex-col gap-2" />
        <div className="col-span-5 flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full !py-5 md:text-lg"
            disabled={
              !selectedSourceId ||
              !selectedTargetId ||
              !sourceAmount ||
              !targetAmount ||
              !rate ||
              loading
            }
          >
            {loading ? (
              <>
                <Spinner />
                <span>Loading...</span>
              </>
            ) : (
              <span>Exchange</span>
            )}
          </Button>
        </div>
      </form>
      {selectedPair && (
        <CardFooter className="flex flex-col items-center">
          <Link
            href="/#latest-table"
            className="transition-all duration-200 text-muted-foreground hover:text-foreground"
          >
            ⇩See other rates.
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
