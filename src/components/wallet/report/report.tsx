"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/front/utils/tailwind";
import Glass from "@/components/ui/glass";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileText } from "lucide-react";
import DropdownArrow from "../../../../public/Common/DropdownArrow.svg";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useGetDeposits as useGetDeposit } from "@/api/wallet/deposit/hook";
import { useGetWithdrawals as useGetWithdrawal } from "@/api/wallet/withdrawal/hook";
import { useGetExchange } from "@/api/wallet/exchange/hooks";
import { useGetTransfers as useGetTransfer } from "@/api/wallet/transfer/hook";
import { useAuthStore } from "@/lib/front/stores/auth";
import { Deposit } from "@/types/front/wallet/deposit";
import { Withdrawal } from "@/types/front/wallet/withdrawal";
import { Exchange } from "@/types/front/wallet/exchange";
import { Transfer } from "@/types/front/wallet/transfer";
import { Currency } from "@/types/front/currency";
import { redirect } from "next/navigation";
type Props = {
  className?: string;
  currencies: Currency[];
};

type TransactionType = "all" | "deposit" | "withdrawal" | "exchange" | "transfer";

type ReportRow = {
  id: string;
  type: Exclude<TransactionType, "all">;
  subject: string;
  paymentMethod: string;
  date: string;
  createdAt: string;
};

const TYPE_OPTIONS: TransactionType[] = [
  "all",
  "deposit",
  "withdrawal",
  "exchange",
  "transfer",
];

const TYPE_CLASS_MAP: Record<TransactionType, string> = {
  all: "text-accent",
  deposit: "text-green",
  withdrawal: "text-red",
  exchange: "text-primary",
  transfer: "text-muted",
};

const formatNumber = (value: unknown) => {
  const asNumber = typeof value === "number" ? value : Number(String(value ?? "0"));
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(asNumber);
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-CA").replace(/-/g, "/");

const Report = ({ className, currencies }: Props) => {
  const t = useTranslations("Wallet");
  const { user } = useAuthStore();
  const requestRef = useRef(0);

  const getDeposit = useGetDeposit();
  const getWithdrawal = useGetWithdrawal();
  const getExchange = useGetExchange();
  const getTransfer = useGetTransfer();
  const getDepositRef = useRef(getDeposit);
  const getWithdrawalRef = useRef(getWithdrawal);
  const getExchangeRef = useRef(getExchange);
  const getTransferRef = useRef(getTransfer);

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReportRow[]>([]);

  const [typeFilter, setTypeFilter] = useState<TransactionType>("all");
  const [typeDraft, setTypeDraft] = useState<TransactionType>("all");
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [currencyDraft, setCurrencyDraft] = useState<Currency | null>(null);
  const [paymentChannel, setPaymentChannel] = useState<{ id: string; name: string } | null>(
    null
  );
  const [paymentChannelDraft, setPaymentChannelDraft] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [typeOpen, setTypeOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [paymentChannelOpen, setPaymentChannelOpen] = useState(false);

  useEffect(() => {
    setTypeDraft(typeFilter);
  }, [typeFilter]);

  useEffect(() => {
    setCurrencyDraft(currency);
  }, [currency]);

  useEffect(() => {
    setPaymentChannelDraft(paymentChannel);
  }, [paymentChannel]);

  useEffect(() => {
    getDepositRef.current = getDeposit;
    getWithdrawalRef.current = getWithdrawal;
    getExchangeRef.current = getExchange;
    getTransferRef.current = getTransfer;
  }, [getDeposit, getWithdrawal, getExchange, getTransfer]);

  const paymentChannels = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    currencies.forEach((curr) => {
      curr.paymentChannels.forEach((channel) => {
        if (!map.has(channel.id)) {
          map.set(channel.id, channel);
        }
      });
    });
    return [...map.values()];
  }, [currencies]);

  useEffect(() => {
    if (!user?.id) return;

    requestRef.current += 1;
    const currentRequest = requestRef.current;
    let active = true;
    Promise.resolve().then(() => {
      if (active && currentRequest === requestRef.current) {
        setLoading(true);
      }
    });

    const withGuard =
      <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
        (value: T[]) => {
          if (active && currentRequest === requestRef.current) {
            setter(value);
          }
        };

    const jobs: Promise<void>[] = [
      new Promise((resolve) => {
        getDepositRef.current({
          filters: {
            userId: user.id,
          },
          setDeposits: withGuard(setDeposits),
          onFinally: resolve,
        });
      }),
      new Promise((resolve) => {
        getWithdrawalRef.current({
          filters: {
            userId: user.id,
          },
          setWithdrawals: withGuard(setWithdrawals),
          onFinally: resolve,
        });
      }),
      new Promise((resolve) => {
        getExchangeRef.current({
          filters: {
            userId: user.id,
          },
          setExchanges: withGuard(setExchanges),
          onFinally: resolve,
        });
      }),
      new Promise((resolve) => {
        getTransferRef.current({
          filters: {
            userId: user.id,
          },
          setTransfers: withGuard(setTransfers),
          onFinally: resolve,
        });
      }),
    ];

    Promise.all(jobs).finally(() => {
      if (active && currentRequest === requestRef.current) {
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    const selectedCurrencyCode = currency?.code;
    const selectedPaymentChannelName = paymentChannel?.name;
    const matchesCurrency = (candidateCode?: string) =>
      !selectedCurrencyCode || candidateCode === selectedCurrencyCode;
    const matchesPaymentChannel = (candidateName?: string) =>
      !selectedPaymentChannelName || candidateName === selectedPaymentChannelName;

    const depositRows: ReportRow[] = deposits
      .filter(
        (item) =>
          matchesCurrency(item.wallet.currency.code) &&
          matchesPaymentChannel(item.paymentChannel?.name)
      )
      .map((item) => ({
        id: item.id,
        type: "deposit",
        subject: `${formatNumber(item.amount)} ${item.wallet.currency.code}`,
        paymentMethod: item.paymentChannel?.name || "-",
        date: formatDate(item.createdAt),
        createdAt: item.createdAt,
      }));

    const withdrawalRows: ReportRow[] = withdrawals
      .filter(
        (item) =>
          matchesCurrency(item.wallet.currency.code) &&
          matchesPaymentChannel(item.paymentChannel?.name)
      )
      .map((item) => ({
        id: item.id,
        type: "withdrawal",
        subject: `${formatNumber(item.amount)} ${item.wallet.currency.code}`,
        paymentMethod: item.paymentChannel?.name || "-",
        date: formatDate(item.createdAt),
        createdAt: item.createdAt,
      }));

    const exchangeRows: ReportRow[] = exchanges
      .filter(
        (item) =>
          (matchesCurrency(item.currencyPair.fromCurrency.code) ||
            matchesCurrency(item.currencyPair.toCurrency.code)) &&
          !selectedPaymentChannelName
      )
      .map((item) => ({
        id: item.id,
        type: "exchange",
        subject: `${formatNumber(item.fromAmount)} ${item.currencyPair.fromCurrency.code} to ${formatNumber(item.toAmount)} ${item.currencyPair.toCurrency.code}`,
        paymentMethod: "-",
        date: formatDate(item.createdAt),
        createdAt: item.createdAt,
      }));

    const transferRows: ReportRow[] = transfers
      .filter((item) => matchesCurrency(item.wallet.currency.code) && !selectedPaymentChannelName)
      .map((item) => ({
        id: item.id,
        type: "transfer",
        subject: `${formatNumber(item.amount)} ${item.wallet.currency.code}`,
        paymentMethod: "Wallet",
        date: formatDate(item.createdAt),
        createdAt: item.createdAt,
      }));

    const allRows = [...depositRows, ...withdrawalRows, ...exchangeRows, ...transferRows];
    const filteredRows =
      typeFilter === "all" ? allRows : allRows.filter((row) => row.type === typeFilter);

    setRows(
      filteredRows.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }, [
    deposits,
    withdrawals,
    exchanges,
    transfers,
    typeFilter,
    currency?.code,
    paymentChannel?.name,
  ]);

  function getUrl(id: string, type: string) {
    const base =
      typeof window !== "undefined"
        ? window.location.href
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const url = new URL(base);
    const currentPath = url.pathname.replace(/\/+$/, "");
    url.pathname = `${currentPath}/${type}/${id}`;
    return url.toString();
  }

  function redirecting(row: ReportRow) {
    const url = getUrl(row.id, row.type);
    redirect(url);
  }

  const renderRow = (row: ReportRow) => (
    <div
      key={`${row.type}-${row.id}`}
      className="w-full flex flex-row gap-3 items-center"
    >
      <div className="w-1/6 h-10 rounded-xl border border-white/20 bg-white/[0.03] px-3 flex items-center justify-center">
        <span className={cn("text-lg font-medium", TYPE_CLASS_MAP[row.type])}>
          {t(row.type.charAt(0) + row.type.slice(1).toLowerCase())}
        </span>
      </div>
      <div className="w-1/3 h-10 rounded-xl border border-white/20 bg-white/[0.03] px-3 flex items-center justify-center text-lg text-gray-200 truncate">
        {row.subject}
      </div>
      <div className="w-1/4 h-10 rounded-xl border border-white/20 bg-white/[0.03] px-3 flex items-center justify-center text-lg text-gray-200 truncate">
        {row.paymentMethod}
      </div>
      <div className="w-1/6 h-10 rounded-xl border border-white/20 bg-white/[0.03] px-3 flex items-center justify-center text-base text-gray-300">
        {row.date}
      </div>
      <Button onClick={() => redirecting(row)} variant={"ghost"} className="w-1/12 flex justify-center text-[#0665ff] hover:text-[#2b7bff] transition-colors">
        <FileText size={18} />
      </Button>
    </div>
  );


  return (
    <section className={cn(className)}>
      <Glass className="rounded-2xl w-full h-full">
        <Card className="p-4 md:p-6 flex flex-col gap-6 w-full h-full">
          <h2 className="text-lg font-semibold">{t("report")}</h2>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <DropdownMenu
              modal={false}
              open={typeOpen}
              onOpenChange={(open) => {
                setTypeOpen(open);
                if (!open) {
                  setTypeFilter(typeDraft);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button className="w-full md:w-[180px] h-10 rounded-lg bg-card hover:bg-card-context/40 px-0 py-1">
                  <Glass className="w-full h-full rounded-sm">
                    <div className="w-full h-full flex justify-between items-center px-3 bg-accent/50">
                      <span>{t(typeDraft)}</span>
                      <Image src={DropdownArrow} alt="Dropdown Arrow" width={16} height={16} />
                    </div>
                  </Glass>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>{t("status")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {TYPE_OPTIONS.map((value) => (
                  <DropdownMenuItem
                    key={t(value)}
                    onClick={() => setTypeDraft(value)}
                    className="hover:bg-card-context/40 rounded-lg"
                  >
                    {value}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu
              modal={false}
              open={currencyOpen}
              onOpenChange={(open) => {
                setCurrencyOpen(open);
                if (!open) {
                  setCurrency(currencyDraft);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button className="w-full md:w-[180px] h-10 rounded-lg bg-card hover:bg-card-context/40 px-0 py-1">
                  <Glass className="w-full h-full rounded-sm">
                    <div className="w-full h-full flex justify-between items-center px-3 bg-accent/50">
                      <span>{currencyDraft ? currencyDraft.code : t("currency")}</span>
                      <Image src={DropdownArrow} alt="Dropdown Arrow" width={16} height={16} />
                    </div>
                  </Glass>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>{t("currencies")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setCurrencyDraft(null)}
                  className="hover:bg-card-context/40 rounded-lg"
                >
                  {t("all")}
                </DropdownMenuItem>
                {currencies.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => setCurrencyDraft(item)}
                    className="hover:bg-card-context/40 rounded-lg"
                  >
                    {item.code}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu
              modal={false}
              open={paymentChannelOpen}
              onOpenChange={(open) => {
                setPaymentChannelOpen(open);
                if (!open) {
                  setPaymentChannel(paymentChannelDraft);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button className="w-full md:w-[220px] h-10 rounded-lg bg-card hover:bg-card-context/40 px-0 py-1">
                  <Glass className="w-full h-full rounded-sm">
                    <div className="w-full h-full flex justify-between items-center px-3 bg-accent/50">
                      <span>
                        {paymentChannelDraft ? paymentChannelDraft.name : t("payment_method")}
                      </span>
                      <Image src={DropdownArrow} alt="Dropdown Arrow" width={16} height={16} />
                    </div>
                  </Glass>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{t("payment_method")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setPaymentChannelDraft(null)}
                  className="hover:bg-card-context/40 rounded-lg"
                >
                  {t("all")}
                </DropdownMenuItem>
                {paymentChannels.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => setPaymentChannelDraft(item)}
                    className="hover:bg-card-context/40 rounded-lg"
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-3">
            <div className="hidden md:flex flex-row gap-3   text-sm text-gray-400 w-full">
              <span className="flex justify-center w-1/6">{t("type")}</span>
              <span className="flex justify-center w-1/3">{t("amount")}</span>
              <span className="flex justify-center w-1/4">{t("payment_method")}</span>
              <span className="flex justify-center w-1/6">{t("date")}</span>
              <span className="flex justify-center w-1/12">{t("details")}</span>
            </div>

            {loading && <div className="text-sm text-gray-400">{t("loading")}</div>}
            {!loading && rows.length === 0 && (
              <div className="text-sm text-gray-400">{t("no-reports-found")}</div>
            )}

            {!loading && rows.length > 0 && (
              <>
                <div className="hidden md:flex flex-col gap-3 h-72 overflow-y-scroll pb-10">{rows.map((row) => renderRow(row))}</div>
                <div className="md:hidden flex flex-col gap-3 h-72 overflow-y-scroll pb-10">
                  {rows.map((row) => (
                    <div key={`mobile-${row.type}-${row.id}`} className="scale-[0.88] origin-top">
                      {renderRow(row)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>
      </Glass>
    </section>
  );
};

export default Report;
