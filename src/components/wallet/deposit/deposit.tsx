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
import { useState } from 'react';
import DropdownArrow from "../../../../public/Common/DropdownArrow.svg";
import { Input } from '@/components/ui/input';
const Deposit = ({ className, currencies }: Props) => {
    const [currency, setCurrency] = useState<Currency | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const t = useTranslations("Wallet");
    return (
        <section className={cn(className)}>
            <Glass className='rounded-lg'>
                <Card className='w-full h-full px-5'>
                    <div className='w-full h-fit flex flex-row gap-x-1 items-center'>
                        <span className='text-green text-lg font-semibold'>{t("deposit")}</span>
                        <Image src={DepositIcon} alt="deposit" className='w-4 h-4' width={16} height={16} />
                    </div>
                    <div className='w-full h-fit flex flex-row items-center'>

                        {/* Currency Dropdown */}
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


                        {/* Amount Input */}
                        <Card className='w-fit h-fit'>
                            <div className='w-full h-full flex flex-row items-center gap-0'>
                                <span>{t("amount")}</span>
                                <Input value={amount ? amount : ""} />
                            </div>
                        </Card>

                    </div>

                </Card>
            </Glass>
        </section>
    )
}

export default Deposit