"use client"
import React from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { Button } from '../ui/button';
import ArrowHead from "../../../public/arrow-head.png";
import Image from 'next/image';
import { useGetCurrencies } from '@/api/currency/hook';
import { useState, useEffect } from 'react';
import { Currency } from '@/types/front/currency';
export default function cards() {

    const [currencies, setCurrencies] = useState<Currency[] | []>([{
        code: "USD",
        createdAt: "2025-12-06T11:18:10.409Z",
        decimals: 2,
        id: "dad26504-cd08-4bbe-bcd5-c8aa5ee69978",
        name: "United States Dollar",
        paymentChannels: [
            {
                id: "6b81a6fd-ab38-48f1-bd01-2ab58628cbc3", name: "Paypal"
            },
            {
                id: "6b81a6fd-ab38-48f1-bd01-2ab58628cbc3", name: "Paypal"
            }
        ],
        symbol: "$"
    }, {
        code: "IRR",
        createdAt: "2025-12-06T11:18:10.409Z",
        decimals: 2,
        id: "dad26504-cd08-4bbe-bcd5-c8aa5ee69978",
        name: "United States Dollar",
        paymentChannels: [
            {
                id: "6b81a6fd-ab38-48f1-bd01-2ab58628cbc3", name: "Paypal"
            },
            {
                id: "6b81a6fd-ab38-48f1-bd01-2ab58628cbc3", name: "Paypal"
            }
        ],
        symbol: "$"
    }]);

    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>();
    const getCurrencies = useGetCurrencies();
    async function getCurr() {
        await getCurrencies({ setCurrencies: setCurrencies });
    }

    // useEffect(() => {
    //     getCurr()
    // }, []);
    return (
        <div className='w-full h-fit flex flex-col backdrop-blur-xl text-[#ebebeb]  border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] rounded-2xl py-3 px-5 gap-y-2'>
            <span className='w-full h-fit text-xl text-foreground'>Cards</span>
            <div className='w-full h-fit flex flex-row justify-between'>
                <div className='w-1/2 h-10 flex flex-row justify-between items-center backdrop-blur-xl bg-gradient-to-br text-[#ebebeb] from-card/10s to-card/5  border-card/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] bg-card/20 border-[0.5px] rounded-lg px-4 py-1'>
                    <span className='w-fit  text-card-foreground'>Currency</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className='w-fit h-fit flex flex-row gap-x-0'>
                                <span className='w-fit h-full text-card-foreground/50 mt-1.5'>
                                    {selectedCurrency ? selectedCurrency.code : "USD"}
                                </span>
                                <Button className='bg-transparent hover:font-bold flex justify-center items-center' variant={"ghost"}>
                                    <Image alt="arrow-down" src={ArrowHead} width={12} height={8} className='w-3 h-2 ' />
                                </Button>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-72 rounded-2xl bg-card/20" align="start">
                            <DropdownMenuLabel>Currencies</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {currencies?.map((curr: Currency, _: number) =>
                                <DropdownMenuItem className='bg-card/80 p-3 rounded-2xl' onClick={() => setSelectedCurrency(curr)}>
                                    {curr?.code}
                                </DropdownMenuItem>)}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}
