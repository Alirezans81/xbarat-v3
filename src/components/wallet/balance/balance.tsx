"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/front/utils/tailwind";
import Glass from "@/components/ui/glass";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Currency } from "@/types/front/currency";
import { Wallet } from "@/types/front/wallet";

type Props = {
    className?: string;
    currencies: Currency[];
    wallets: Wallet[];
};

const Balance = ({ className, currencies = [], wallets = [] }: Props) => {
    const t = useTranslations("Wallet");

    const [selectedIndex, setSelectedIndex] = useState(0);
    const normalizedIndex = currencies.length
        ? selectedIndex % currencies.length
        : 0;

    const selectedCurrency = useMemo(() => {
        if (!currencies.length) return null;
        return currencies[normalizedIndex] ?? null;
    }, [currencies, normalizedIndex]);

    const selectedWallet = useMemo(() => {
        if (!selectedCurrency) return null;
        return wallets.find((w) => w.currencyId === selectedCurrency.id) ?? null;
    }, [wallets, selectedCurrency]);

    const handleNext = () => {
        if (!currencies.length) return;
        setSelectedIndex((prev) => (prev + 1) % currencies.length);
    };

    const handlePrev = () => {
        if (!currencies.length) return;
        setSelectedIndex((prev) =>
            prev === 0 ? currencies.length - 1 : prev - 1
        );
    };

    // Total balance for portfolio ratio (for future chart usage)
    const totalBalance = useMemo(() => {
        return wallets.reduce((acc, w) => acc + (+w.balance || 0), 0);
    }, [wallets]);

    return (
        <section className={cn("w-full h-full p-4 sm:p-6", className)}>
            <Glass className="rounded-2xl p-0">
                <Card className="w-full h-full px-4 py-5 sm:px-6 sm:py-6 flex flex-col gap-8 border-none shadow-none">

                    {/* Header */}
                    <span className="text-accent-foreground text-lg font-medium">
                        {t("balance")}
                    </span>

                    {/* Balance Carousel */}
                    <div className="relative flex items-center justify-center px-6">
                        <ChevronLeft
                            onClick={handlePrev}
                            className="absolute left-0 text-muted-foreground cursor-pointer hover:text-foreground transition"
                        />

                        <div className="w-full max-w-[420px] h-[120px] sm:h-[140px] rounded-xl bg-gradient-to-br from-[#050b1a] to-[#0b1f4b] p-4 sm:p-6 flex flex-col justify-end">
                            <span className="text-sm text-muted-foreground">
                                {t("available_balance")}
                            </span>

                            <span className="text-xl sm:text-2xl font-semibold text-white">
                                {+(selectedWallet?.balance ?? 0)}{" "}
                                {selectedCurrency?.symbol ?? ""}
                            </span>
                        </div>

                        <ChevronRight
                            onClick={handleNext}
                            className="absolute right-0 text-muted-foreground cursor-pointer hover:text-foreground transition"
                        />
                    </div>

                    {/* Portfolio Section */}
                    <div className="flex flex-col gap-4">
                        <span className="text-accent-foreground text-lg font-medium">
                            {t("portfolio")}
                        </span>

                        <div className="flex flex-col md:flex-row gap-6 items-center">

                            {/* Currency List */}
                            <div className="flex flex-col gap-2 flex-1 w-full">
                                {wallets.map((wallet) => {
                                    const currency = currencies.find(
                                        (c) => c.id === wallet.currencyId
                                    );

                                    const percentage =
                                        totalBalance > 0
                                            ? ((+wallet.balance / totalBalance) * 100).toFixed(1)
                                            : "0";

                                    return (
                                        <div
                                            key={wallet.id}
                                            className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2 text-sm sm:text-base"
                                        >
                                            <span>
                                                {currency?.name ?? "Unknown"}
                                            </span>

                                            <div className="flex gap-3">
                                                <span>
                                                    {+wallet.balance} {currency?.symbol ?? ""}
                                                </span>
                                                <span className="text-muted-foreground text-xs">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Donut Placeholder */}
                            {/* <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full border border-muted/40 flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
                                Chart
                            </div> */}
                        </div>
                    </div>
                </Card>
            </Glass>
        </section>
    );
};

export default Balance;
