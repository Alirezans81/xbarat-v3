"use client"

import React from 'react'
import { cn } from '@/lib/front/utils/tailwind'
import { useTranslations } from "next-intl";

import Image from 'next/image';
import DepositIcon from "../../../../public/Wallet/deposit.svg";
import Glass from '@/components/ui/glass';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Currency } from '@/types/front/currency';
type Props = {
    className: string;
    currencies: Currency[] | null
}
import { useCreateDeposit } from '@/api/wallet/deposit/hook';
import { useGetWallets } from '@/api/wallet/hook';
import { useState, useEffect } from 'react';
import DropdownArrow from "../../../../public/Common/DropdownArrow.svg";
import { Input } from '@/components/ui/input';
import { removeComma, addComma } from '@/lib/front/utils/number';
import { Wallet } from "@/types/front/wallet";
import { PaymentChannel } from '@/types/front/paymentChannel';
import { useGetPaymentChannels } from '@/api/payment-channel/hook';
const Deposit = ({ className, currencies }: Props) => {
    const t = useTranslations("Wallet");
    const [currency, setCurrency] = useState<Currency | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [displayAmount, setDisplayAmount] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [AmountError, setAmountError] = useState("");
    const [paymentChannels, setPaymentChannels] = useState<PaymentChannel[]>([]);
    const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>();
    const [paymentChannelIdError, setPaymentChannelIdError] = useState("");
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [walletId, setWalletId] = useState("");
    const createDeposit = useCreateDeposit();
    const getPaymentChannels = useGetPaymentChannels();
    const getWallets = useGetWallets();
    const validateAmount = (value: string) => {
        if (!value) {
            setAmountError("Amount required!");
            return false;
        }

        return true;
    };
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        const rawValue = removeComma(inputValue);
        setAmount(rawValue);

        const formattedValue = addComma(rawValue);
        setDisplayAmount(formattedValue);
    };
    const validatePaymentChannelId = (value: string) => {
        if (!value) {
            setPaymentChannelIdError("Payment Channel required!");
            return false;
        }
        setAmountError("");
        return true;
    };

    const findWallet = (): Wallet | null => {
        return wallets.find((e) => e.currencyId === currency?.id) || null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const walletFound = findWallet();
        if (walletFound !== undefined && walletFound) {
            setWalletId(walletFound.id);
        }
        setLoading(true);
        if (paymentChannel && validatePaymentChannelId(paymentChannel.id) && walletId && validateAmount(amount.toString())) {
            createDeposit({
                deposit: {
                    amount: +amount,
                    walletId: walletId,
                    paymentChannelId: paymentChannel?.id,
                }
            });
        };
    };

    useEffect(() => {
        setLoading(true);
        getWallets({
            setWallets,
            onFinally() {
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        if (currency) {
            setLoading(true);
            getPaymentChannels({
                setPaymentChannels,
                filters: {
                    currencyId: currency?.id,
                },
                onFinally() {
                    setLoading(false);
                },
            });
        }
    }, [currency]);

    return (
        <section className={cn(className)}>
            <Glass className='rounded-lg'>

                <Card className='w-full h-full px-4 flex flex-col items-center'>

                    <div className='w-full h-fit flex flex-row gap-x-1 items-center'>
                        <span className='text-green text-lg font-semibold'>{t("deposit")}</span>
                        <Image src={DepositIcon} alt="deposit" className='w-4 h-4' width={16} height={16} />
                    </div>

                    <div className='w-full h-24 grid grid-cols-2 grid-rows-2 gap-x-3'>
                        {/* Currency Dropdown */}
                        <div className='col-span-1 row-span-1 w-full h-full'>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button className="w-full h-full rounded-lg bg-card hover:bg-card-context/40 px-0 py-1">
                                        <Glass className="w-full h-full rounded-sm">
                                            <div className="w-full h-full flex flex-row justify-between items-center px-3 bg-accent/50">
                                                <span className="w-fit h-fit">
                                                    {currency ? currency.code : t("currency")}
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
                                    {currencies?.map((currency, index) => (
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
                        {/* Amount Input */}
                        <Card className='col-span-1 row-span-1 w-full h-full p-0 rounded-sm'>
                            <div className='w-full h-full flex flex-row items-center justify-between gap-x-2 px-2 py-1'>
                                <span className='text-sm'>{t("amount")}</span>
                                <Input className='w-fit' onChange={handleAmountChange} value={displayAmount} />
                            </div>
                        </Card>

                        {/* Payment Channel */}
                        <div className='col-span-2 row-span-1 w-full h-full'>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button className="w-full h-full rounded-lg bg-card hover:bg-card-context/40 px-0 py-1">
                                        <Glass className="w-full h-full rounded-sm">
                                            <div className="w-full h-full flex flex-row justify-between items-center px-3 bg-accent/50">
                                                <span className="w-fit h-fit">
                                                    {paymentChannel ? paymentChannel.name : "Payment Channel"}
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
                                        {t("payment-channels")}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {paymentChannels?.map((payChannel, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={() => setPaymentChannel(payChannel)}
                                            className="w-full px-2 py-1 hover:cursor-pointer hover:bg-card-context/40 rounded-lg"
                                        >
                                            {payChannel.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Button onClick={() => handleSubmit} className='w-3/4 rounded-sm text-md'>{t("submit")}</Button>

                </Card>
            </Glass>
        </section >
    )
}

export default Deposit