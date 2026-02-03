"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { addComma, roundDown } from "@/lib/front/utils/number";
import { Currency } from "@/types/front/currency";
import { CurrencyPair } from "@/types/front/currencyPair";
import { Wallet } from "@/types/front/wallet";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

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
  const [draftSourceId, setDraftSourceId] = useState(
    selectedPair?.fromCurrency.id ?? ""
  );
  const [sourcesPopoverOpen, setSourcesPopoverOpen] = useState(false);

  const [draftTargetId, setDraftTargetId] = useState(
    selectedPair?.toCurrency.id ?? ""
  );
  const [targetsPopoverOpen, setTargetsPopoverOpen] = useState(false);

  const selectedSourceId = selectedPair?.fromCurrency.id ?? draftSourceId;
  const selectedTargetId = selectedPair?.toCurrency.id ?? draftTargetId;

  const selectedSource = currencies.find((e) => e.id === selectedSourceId);
  const selectedTarget = currencies.find((e) => e.id === selectedTargetId);
  const foundWallet = wallets.find((e) => e.currencyId === selectedSourceId);

  const [amount, setAmount] = useState<number>();
  const [lastEdited, setLastEdited] = useState<"source" | "target">("source");

  const SPLIT_INDEX = 4;

  const syncSelectedPair = (nextSourceId: string, nextTargetId: string) => {
    if (nextSourceId && nextTargetId) {
      const foundCurrencyPair = currencyPairs.find(
        (e) =>
          e.fromCurrencyId === nextSourceId &&
          e.toCurrencyId === nextTargetId
      );

      if (foundCurrencyPair) {
        setSelectedPair(foundCurrencyPair);
        return;
      }
    }

    setSelectedPair(null);
  };

  const { sourceAmount, targetAmount } = useMemo(() => {
    if (!selectedPair || !rate || !amount) {
      return {
        sourceAmount: lastEdited === "source" ? amount : undefined,
        targetAmount: lastEdited === "target" ? amount : undefined,
      };
    }

    if (lastEdited === "source") {
      const computedTarget = selectedPair.isInverseRate
        ? amount * rate
        : selectedTarget
          ? roundDown(amount / rate, selectedTarget.decimals)
          : undefined;
      return { sourceAmount: amount, targetAmount: computedTarget };
    }

    const computedSource = selectedPair.isInverseRate
      ? selectedSource
        ? roundDown(amount / rate, selectedSource.decimals)
        : undefined
      : amount * rate;
    return { sourceAmount: computedSource, targetAmount: amount };
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

  return (
    <Card className="w-fit mx-auto">
      <form
        className="grid grid-cols-11 gap-y-4 px-6 py-2.5"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="col-span-5 flex flex-col gap-2">
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
                className="w-16 border-muted hover:cursor-pointer"
                disabled={selectedTargetId === currency.id}
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
                        className="w-16 border-muted hover:cursor-pointer col-span-1"
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
        <div className="col-span-5 flex flex-col gap-2">
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
                className="w-16 border-muted hover:cursor-pointer"
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
                        className="w-16 border-muted hover:cursor-pointer col-span-1"
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
              className="!text-lg"
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
            <span className="text-sm text-secondary">
              Available Balance: {selectedSource.symbol}
              {""}
              {addComma(foundWallet.balance || 0)}
            </span>
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
            className="!text-lg !py-5"
            type="number"
            inputMode="decimal"
            value={targetAmount}
            onChange={(e) => handleTargetAmountChange(+e.currentTarget.value)}
          />
        </div>
        <div className="col-span-5 flex flex-col gap-2">
          <Input
            placeholder="Rate"
            className="!text-lg !py-5"
            type="number"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(+e.currentTarget.value)}
          />
        </div>
        <div className="col-span-1 flex flex-col gap-2" />
        <div className="col-span-5 flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full !py-5 !text-lg"
            disabled={
              !selectedSourceId ||
              !selectedTargetId ||
              !sourceAmount ||
              !targetAmount ||
              !rate
            }
          >
            Exchange
          </Button>
        </div>
      </form>
    </Card>
  );
}
