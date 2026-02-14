"use client";
import { cn } from "@/lib/front/utils/tailwind";

import { Currency } from "@/types/front/currency";
import AddCardDialog from "../dialog/profile/add-card-dialog";
import Glass from "../ui/glass";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import EditCardDialog from "../dialog/profile/edit-card-dialog";
import DropdownArrow from "../../../public/Common/DropdownArrow.svg";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import Image from "next/image";
import { Card } from "../ui/card";
import { useState } from "react";
import { useTranslations } from "next-intl";
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
  account_type: string;
  is_Default: boolean;
};
type UserCard = {
  id: string;
  account_type: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  is_Default: boolean;
};

type CardsByCurrency = {
  [currencyCode: string]: UserCard[];
};

const COOKIE_KEY = "user_cards";

export function loadCards(): CardsByCurrency {
  try {
    const raw = Cookies.get(COOKIE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCards(cards: CardsByCurrency) {
  Cookies.set(COOKIE_KEY, JSON.stringify(cards), {
    expires: 365,
    sameSite: "lax",
  });
}

export default function CardsCard({ className, currencies }: Props) {
  const [currency, setCurrency] = useState<Currency>();
  const [cardsByCurrency, setCardsByCurrency] =
    useState<CardsByCurrency>(loadCards());
  const cards = currency ? (cardsByCurrency[currency.code] ?? []) : [];

  function addCard(newCard: Omit<UserCard, "id">) {
    if (!currency) return;

    const updated = {
      ...cardsByCurrency,
      [currency.code]: [
        ...(cardsByCurrency[currency.code] ?? []),
        { ...newCard, id: crypto.randomUUID() },
      ],
    };

    setCardsByCurrency(updated);
    saveCards(updated);
  }
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState<UserCard | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const t = useTranslations("Profile");
  return (
    <section className={cn(className)}>
      <Glass className="rounded-lg w-full h-full max-h-72">
        <Card className="w-full h-full flex flex-col items-center px-7 text-muted-foreground/75">
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
                    {t("currencies")}
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

            <Button
              disabled={cards.length > 1 ? true : false}
              className={"bg-transparent"}
              variant={"default"}
              onClick={() => setShowAddModal(true)}
            >
              {t("add-cards") + " + "}
            </Button>
          </div>

          <div
            className={`${cards.length === 0
              ? "hidden"
              : "w-full h-full flex flex-col gap-4"
              }`}
          >
            {/* Header */}
            <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-4 text-xs text-muted-foreground mb-3 px-2">
              <span />
              <span>{t("account-number-address")}</span>
              <span>{t("type-of-account")}</span>
              <span>{t("cardholder-name")}</span>
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="grid grid-cols-[80px_1fr_1fr_1fr] gap-4 items-center"
                >
                  {/* Edit */}
                  <Button
                    onClick={() => {
                      setEditingCard(card);
                      setShowEditModal(true);
                    }}
                    variant={"ghost"}
                    className="bg-transparent text-primary text-sm hover:underline"
                  >
                    {t("edit")}
                  </Button>

                  {/* Account */}
                  <div className="px-4 py-2 rounded-lg bg-card  text-sm truncate">
                    {card.account_number}
                  </div>

                  {/* Type */}
                  <div className="px-4 py-2 rounded-lg bg-card  text-sm">
                    {card.account_type}
                  </div>

                  {/* Name */}
                  <div className="px-4 py-2 rounded-lg bg-card  text-sm truncate">
                    {card.account_name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`${currency && cards.length === 0
              ? "w-full h-full flex justify-center items-center text-card-foreground text-2xl"
              : "hidden"
              }`}
          >
            {t("no-cards")}
          </div>
        </Card>
      </Glass>
      <AddCardDialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        currencies={currencies}
        onSubmit={(data) => {
          addCard({
            account_name: data.accountName,
            bank_name: data.bankName,
            account_number: data.accountNumber,
            account_type: data.accountType,
            is_Default: false
          });
        }}
      />
      {editingCard && (
        <EditCardDialog
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onDelete={() => {
            if (!currency) return;
            const updated = cardsByCurrency[currency.code].filter(
              (c) => c.id !== editingCard.id,
            );
            setCardsByCurrency({
              ...cardsByCurrency,
              [currency.code]: updated,
            });
            saveCards({ ...cardsByCurrency, [currency.code]: updated });
            setShowEditModal(false);
          }}
          onDeactivate={() => {
            if (!currency) return;
            const updated = cardsByCurrency[currency.code].filter(
              (c) => c.id !== editingCard.id,
            );
            setCardsByCurrency({
              ...cardsByCurrency,
              [currency.code]: updated,
            });
            saveCards({ ...cardsByCurrency, [currency.code]: updated });
            setShowEditModal(false);
          }}
          onSetDefault={() => {
            if (!currency) return;
            const updated = cardsByCurrency[currency.code].map((c) => ({
              ...c,
              isDefault: c.id === editingCard.id,
            }));
            setCardsByCurrency({
              ...cardsByCurrency,
              [currency.code]: updated,
            });
            saveCards({ ...cardsByCurrency, [currency.code]: updated });
            setShowEditModal(false);
          }}
        />
      )}
    </section>
  );
}
