"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/front/utils/tailwind";
import Glass from "@/components/ui/glass";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import { useGetDeposits } from "@/api/wallet/deposit/hook";
import { Deposit } from "@/types/front/wallet/deposit";
import { DepositStatus } from "@/generated/prisma";
import { Currency } from "@/types/front/currency";

type Props = {
    className?: string;
    currencies: Currency[];
    paymentChannels: { id: string; name: string }[];
};

const Report = ({
    className,
    currencies,
    paymentChannels,
}: Props) => {
    const t = useTranslations("Wallet");
    const getDeposits = useGetDeposits();

    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState<DepositStatus | null>(null);
    const [currency, setCurrency] = useState<Currency | null>(null);
    const [paymentChannel, setPaymentChannel] = useState<{
        id: string;
        name: string;
    } | null>(null);

    // Refetch when ALL filters are selected
    useEffect(() => {
        if (!status || !currency || !paymentChannel) return;

        setLoading(true);

        getDeposits({
            filters: {
                status,
                currencyId: currency.id,
                paymentChannelId: paymentChannel.id,
            },
            setDeposits,
            onFinally: () => setLoading(false),
        });
    }, [status, currency, paymentChannel, fetch]);

    return (
        <section className={cn("w-full p-4 sm:p-6", className)}>
            <Glass className="rounded-2xl w-full h-full">
                <Card className="p-6 flex flex-col gap-6 border-none shadow-none w-full h-full">

                    <h2 className="text-lg font-semibold">{t("report")}</h2>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">

                        {/* STATUS */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full md:w-[180px] h-10 rounded-lg bg-card hover:bg-card-context/40 px-0 py-1">
                                    <Glass className="w-full h-full rounded-sm">
                                        <div className="w-full h-full flex justify-between items-center px-3 bg-accent/50">
                                            <span>
                                                {status ?? t("status")}
                                            </span>
                                            <Image
                                                src={DropdownArrow}
                                                alt="Dropdown Arrow"
                                                width={16}
                                                height={16}
                                            />
                                        </div>
                                    </Glass>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>
                                    {t("status")}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {Object.values(DepositStatus).map((s) => (
                                    <DropdownMenuItem
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className="hover:bg-card-context/40 rounded-lg"
                                    >
                                        {s}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* CURRENCY */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full md:w-[180px] h-10 rounded-lg bg-card hover:bg-card-context/40 px-0 py-1">
                                    <Glass className="w-full h-full rounded-sm">
                                        <div className="w-full h-full flex justify-between items-center px-3 bg-accent/50">
                                            <span>
                                                {currency ? currency.code : t("currency")}
                                            </span>
                                            <Image
                                                src={DropdownArrow}
                                                alt="Dropdown Arrow"
                                                width={16}
                                                height={16}
                                            />
                                        </div>
                                    </Glass>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>
                                    {t("currencies")}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {currencies?.map((c) => (
                                    <DropdownMenuItem
                                        key={c.id}
                                        onClick={() => setCurrency(c)}
                                        className="hover:bg-card-context/40 rounded-lg"
                                    >
                                        {c.code}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* PAYMENT CHANNEL */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full md:w-[180px] h-10 rounded-lg bg-card hover:bg-card-context/40 px-0 py-1">
                                    <Glass className="w-full h-full rounded-sm">
                                        <div className="w-full h-full flex justify-between items-center px-3 bg-accent/50">
                                            <span>
                                                {paymentChannel
                                                    ? paymentChannel.name
                                                    : t("payment_method")}
                                            </span>
                                            <Image
                                                src={DropdownArrow}
                                                alt="Dropdown Arrow"
                                                width={16}
                                                height={16}
                                            />
                                        </div>
                                    </Glass>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-48">
                                <DropdownMenuLabel>
                                    {t("payment_method")}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {paymentChannels?.map((p) => (
                                    <DropdownMenuItem
                                        key={p.id}
                                        onClick={() => setPaymentChannel(p)}
                                        className="hover:bg-card-context/40 rounded-lg"
                                    >
                                        {p.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                    {/* REPORT LIST */}
                    <div className="flex flex-col gap-3">
                        {loading && (
                            <div className="text-muted-foreground text-sm">
                                Loading...
                            </div>
                        )}

                        {!loading &&
                            deposits.map((deposit) => (
                                <div
                                    key={deposit.id}
                                    className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-muted/30 rounded-lg px-4 py-3 text-sm items-center"
                                >
                                    <div>{deposit.status}</div>
                                    <div>
                                        {deposit.amount.toNumber()}
                                    </div>
                                    <div>
                                        {deposit.paymentChannel?.name}
                                    </div>
                                    <div>
                                        {new Date(deposit.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-blue-500 cursor-pointer">
                                        Details
                                    </div>
                                </div>
                            ))}
                    </div>

                </Card>
            </Glass>
        </section>
    );
};

export default Report;
