"use client";

import { Currency } from "@/types/front/currency";
import { CurrencyPair } from "@/types/front/currencyPair";
import { Wallet } from "@/types/front/wallet";

interface Props {
  rate: string;
  setRate: (numRate: string) => void;
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
  wallets: outerWallet,
  selectedPair,
  setSelectedPair,
}: Props) {
  
}
