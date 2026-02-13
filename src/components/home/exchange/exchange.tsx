"use client";

import ExchangeForm from "./exchange-form";
import OrderBook from "./order-book";
import { Currency } from "@/types/front/currency";
import { CurrencyPair } from "@/types/front/currencyPair";
import { Wallet } from "@/types/front/wallet";
import { useState } from "react";
import WatchList from "./watch-list";

interface Props {
  currencies: Currency[];
  currencyPairs: CurrencyPair[];
  wallets: Wallet[];
}
export default function Exchange({
  currencies,
  currencyPairs,
  wallets: outerWallet,
}: Props) {
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(null);
  const [rate, setRate] = useState<number>();

  return (
    <div className="w-screen px-5 sm:px-10 flex flex-col gap-4 h-full">
      <ExchangeForm
        rate={rate}
        setRate={setRate}
        currencies={currencies}
        currencyPairs={currencyPairs}
        wallets={outerWallet}
        selectedPair={selectedPair}
        setSelectedPair={setSelectedPair}
      />
      <WatchList
        selectedPair={selectedPair}
        setSelectedPair={setSelectedPair}
      />
      <OrderBook
        setRate={setRate}
        currencyPairs={currencyPairs}
        currencyPair={selectedPair}
      />
    </div>
  );
}
