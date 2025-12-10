"use client"
import ExchangeForm from "./ExchangeForm"
import OrderBook from "./OrderBook"
import { Currency } from "@/types/front/currency";
import { CurrencyPair } from "@/types/front/currencyPair";
import { Wallet } from "@/types/front/wallet";
import { useState } from "react";

interface Props {
    currencies: Currency[];
    currencyPairs: CurrencyPair[];
    wallets: Wallet[];
};
export default function Exchange({
    currencies,
    currencyPairs,
    wallets: outerWallet,
}: Props) {
    const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(null);
    const [rate, setRate] = useState<string>("");

    return (
        <div className="flex flex-col gap-4 h-full">
            <ExchangeForm
                rate={rate}
                setRate={setRate}
                currencies={currencies}
                currencyPairs={currencyPairs}
                wallets={outerWallet}
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