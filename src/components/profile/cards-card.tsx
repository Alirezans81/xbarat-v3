"use client";
import { cn } from "@/lib/front/utils/tailwind";

import { Currency } from "@/types/front/currency";

import Glass from "../ui/glass";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import DropdownArrow from "../../../public/Profile/DropdownArrow.svg";
import { Button } from "../ui/button";
import Image from "next/image";
import { Card } from "../ui/card";
import { useState } from "react";
type Props = {
  className?: string;
  currencies: Currency[];
};
type Card = {
  currencyId: string;
  currencyCode: string;
  account_number: string;
  account_name: string;
  bank_name: string;
};

export default function CardsCard({ className, currencies }: Props) {
  const [currency, setCurrency] = useState<Currency>();
  const [cards, setCards] = useState<Card[]>([]);
  return (
    <section className={cn(className)}>
      <Glass className="rounded-lg w-full h-full max-h-72">
        <Card className="w-full h-full flex flex-col items-center px-7 text-[#3c3c46]">
          <span className="text-lg w-full text-start">Cards</span>

          {/* First Row Cards and add Card */}
          <div className="w-full h-fit flex flex-row justify-between">
            <div className="w-fit min-w-1/2 h-fit">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full h-full bg-card rounded-lg  hover:bg-card-context/40 p-0">
                    <Glass className="w-full h-full rounded-sm px-3 py-2">
                      <div className="w-full h-full flex flex-row justify-between items-center">
                        <span className="w-fit h-fit">
                          {currency ? currency.code : "Currency"}
                        </span>
                        <Image
                          src={DropdownArrow}
                          alt="Dropdown Arrow"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                      </div>
                    </Glass>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full h-full">
                  <DropdownMenuLabel className="text-lg">
                    Currencies
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {currencies.map((currency, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setCurrency(currency)}
                      className="w-full px-2 py-1 hover:cursor-pointer hover:bg-card-context/40 rounded-lg"
                    >
                      {currency.code}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div
            className={`${
              cards.length === 0
                ? "hidden"
                : "w-full h-full flex justify-center items-center"
            }`}
          >
            Cards
          </div>
          <div
            className={`${
              currency && cards.length === 0
                ? "w-full h-full flex justify-center items-center text-card-foreground text-2xl"
                : "hidden"
            }`}
          >
            You Currently Do not have any Cards!
          </div>
        </Card>
      </Glass>
    </section>
  );
}
