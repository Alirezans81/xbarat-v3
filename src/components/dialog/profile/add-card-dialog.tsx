"use client";

import { useState } from "react";
import Glass from "@/components/ui/glass";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import DropdownArrow from "../../../../public/Profile/DropdownArrow.svg";
import { Currency } from "@/types/front/currency";

type Props = {
  open: boolean;
  onClose: () => void;
  currencies: Currency[];
  onSubmit: (data: {
    currencyCode: string;
    accountType: string;
    accountName: string;
    bankName: string;
    accountNumber: string;
  }) => void;
};

const ACCOUNT_TYPES = [
  "Commerz",
  "Card Number",
  "Wallet Address",
  "Paypal",
  "Deutsche",
];

export default function AddCardDialog({
  open,
  onClose,
  currencies,
  onSubmit,
}: Props) {
  const [currency, setCurrency] = useState<Currency>();
  const [accountType, setAccountType] = useState<string>();
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  if (!open) return null;

  function handleSubmit() {
    if (!currency || !accountType) return;

    onSubmit({
      currencyCode: currency.code,
      accountType,
      accountName,
      bankName,
      accountNumber,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Glass className="rounded-xl w-full max-w-md">
        <Card className="px-6 py-5 flex flex-col gap-4">
          <span className="text-lg">Add New Card</span>

          {/* Currency */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="w-full bg-card p-0">
                <Glass className="w-full px-3 py-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span>{currency?.code ?? "Currency"}</span>
                    <Image src={DropdownArrow} alt="" width={16} height={16} />
                  </div>
                </Glass>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {currencies.map((c) => (
                <DropdownMenuItem key={c.code} onClick={() => setCurrency(c)}>
                  {c.code}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Account Type */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="w-full bg-card p-0">
                <Glass className="w-full px-3 py-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <span>{accountType ?? "Account Type"}</span>
                    <Image src={DropdownArrow} alt="" width={16} height={16} />
                  </div>
                </Glass>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ACCOUNT_TYPES.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setAccountType(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Inputs */}
          <Input
            placeholder="Card Holder Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
          <Input
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <Input
            placeholder="Account Number / Address"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </Card>
      </Glass>
    </div>
  );
}
