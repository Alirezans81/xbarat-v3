"use client"

import React from 'react';
import { cn } from '@/lib/front/utils/tailwind';
import { useTranslations } from "next-intl";
import { Currency } from '@/types/front/currency';
import WithdrawalIcon from "../../../../public/Wallet/withdrawal.svg";
import Glass from '@/components/ui/glass';
import { Card } from '@/components/ui/card';
import DropdownArrow from "../../../../public/Common/DropdownArrow.svg";
import { Input } from '@/components/ui/input';
import { removeComma, addComma } from '@/lib/front/utils/number';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCreateWithdrawal } from '@/api/wallet/withdrawal/hook';
import { useGetWallets } from '@/api/wallet/hook';
import { Wallet } from '@/types/front/wallet';
import Cookies from 'js-cookie';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LoadingIndicator from "@/components/ui/loading-indicator";
type Props = {
    className: string;
    currencies: Currency[] | null
};
type UserCard = {
    id: string;
    account_type: string;
    account_number: string;
    account_name: string;
    bank_name: string;
    is_Default: boolean;
};
type PaymentChannelCurrency = {
    id: string;
    name: string;
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
export function getCardsByCurrency(selectedCurrency: string): UserCard[] {
    const userCards = loadCards();
    return userCards[selectedCurrency] || [];
}

const Withdrawal = ({ className, currencies }: Props) => {
    const t = useTranslations("Wallet");
    const [currency, setCurrency] = useState<Currency | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [displayAmount, setDisplayAmount] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [AmountError, setAmountError] = useState("");
    const [paymentChannel, setPaymentChannel] = useState<PaymentChannelCurrency>();
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const createWithdrawal = useCreateWithdrawal();
    const getWallets = useGetWallets();
    const userCards = loadCards();
    const [selectedCard, setSelectedCard] = useState<UserCard | null>();
    const validateAmount = (value: string) => {
        if (!value) {
            setAmountError("Amount required!");
            return false;
        }

        return true;
    };
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setAmountError("");

        const rawValue = removeComma(inputValue);
        setAmount(rawValue);

        const formattedValue = addComma(rawValue);
        setDisplayAmount(formattedValue);
    };

    const findWallet = (): Wallet | null => {
        return wallets.find((e) => e.currencyId === currency?.id) || null;
    };

    useEffect(() => {
        getWallets({
            setWallets,
            onFinally() {
                setLoading(false);
            }
        });
    }, [getWallets]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const walletFound = findWallet();
        if (paymentChannel && walletFound && validateAmount(amount.toString()) && selectedCard) {
            createWithdrawal({
                withdrawal: {
                    amount: +amount,
                    walletId: walletFound.id,
                    paymentChannelId: paymentChannel?.id,
                    receiverAddress: selectedCard?.account_number,
                    addressOwnerName: selectedCard?.account_name,
                }
            });
        };
    };

    return (
        <section className={cn(className)}>
            <Glass className='rounded-lg'>

                <Card className='w-full h-full px-4 flex flex-col items-center'>

                    <div className='w-full h-fit flex flex-row gap-x-1 items-center'>
                        <span className='text-red text-lg font-semibold'>{t("withdrawal")}</span>
                        <Image src={WithdrawalIcon} alt="Withdrawal" className='w-4 h-4' width={16} height={16} />
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
                                <span className='text-sm flex items-center gap-1'>
                                    {t("amount")}
                                    {AmountError && (
                                        <Popover open={Boolean(AmountError)}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    aria-label="Amount validation error"
                                                    className="text-red text-xs font-semibold"
                                                >
                                                    !
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-fit max-w-56 py-2 px-3 text-sm text-red">
                                                {AmountError}
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </span>
                                <Input className='w-fit' onChange={handleAmountChange} value={displayAmount} />
                            </div>
                        </Card>

                        {/* Payment Channel */}
                        <div className='col-span-1 row-span-1 w-full h-full'>
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
                                    {currency?.paymentChannels?.map((payChannel, index) => (
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


                        {/* Reciever Address */}
                        <div className='col-span-1 row-span-1 w-full h-full'>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button className="w-full h-full rounded-lg bg-card hover:bg-card-context/40 px-0 py-1">
                                        <Glass className="w-full h-full rounded-sm">
                                            <div className="w-full h-full flex flex-row justify-between items-center px-3 bg-accent/50">
                                                <span className="w-fit h-fit">
                                                    {selectedCard ? selectedCard.account_name : t("user-card")}
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
                                        {t("user-card")}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {currency && userCards && userCards[currency?.code]?.map((card, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={() => setSelectedCard(card)}
                                            className="w-full px-2 py-1 hover:cursor-pointer hover:bg-card-context/40 rounded-lg"
                                        >
                                            {card.account_name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {loading && <LoadingIndicator className="mt-3 self-start" />}

                    <Button onClick={handleSubmit} className='w-3/4 rounded-sm text-md'>{t("submit")}</Button>

                </Card>
            </Glass>
        </section >
    )
}

export default Withdrawal;
