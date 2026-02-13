"use client"
import React from 'react';
import { cn } from '@/lib/front/utils/tailwind';
import Glass from '@/components/ui/glass'
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Currency } from '@/types/front/currency';
import { Wallet } from '@/types/front/wallet';
type Props = {
    className?: string,
    currencies: Currency[],
    wallets: Wallet[]
}
import { useState, useEffect } from 'react';

const Balance = ({ className, currencies, wallets }: Props) => {
    const t = useTranslations('Wallet');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>();
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>();

    useEffect(() => {
        setSelectedCurrency(currencies[selectedIndex]);
        if (selectedCurrency && selectedCurrency !== undefined && wallets && wallets !== undefined) {
            const temp = wallets.filter((wall) => wall.currencyId === selectedCurrency?.id)[0];
            setSelectedWallet(temp)
        }
    }, [selectedIndex]);
    console.log(selectedWallet);
    return (
        <section className={cn('w-full h-full', className)}>
            <Glass className="rounded-2xl p-0">
                <Card className="w-full h-full px-4 py-3 flex flex-col gap-6 border-none shadow-none">

                    {/* Balance Header */}
                    <span className="text-accent-foreground text-lg font-medium">
                        {t('balance')}
                    </span>

                    {/* Balance Card */}
                    <div className="relative flex items-center justify-center">
                        <ChevronLeft className="absolute left-0 text-muted-foreground cursor-pointer" />

                        <div className="w-[260px] h-[120px] rounded-xl bg-gradient-to-br from-[#050b1a] to-[#0b1f4b] p-4 flex flex-col justify-end">
                            <span className="text-sm text-muted-foreground">
                                {t('available_balance')}
                            </span>
                            <span className="text-2xl font-semibold text-white">
                                <span>{selectedWallet?.balance.toString()}</span>
                                {/* <span>{selectedWallet?.currency}</span> */}
                            </span>
                        </div>

                        <ChevronRight className="absolute right-0 text-muted-foreground cursor-pointer" />
                    </div>

                    {/* Portfolio Section */}
                    <div className="flex flex-col gap-4">
                        <span className="text-accent-foreground text-lg font-medium">
                            {t('portfolio')}
                        </span>

                        <div className="flex gap-4 items-center">
                            {/* Currency List */}
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2">
                                    <span>EURO</span>
                                    <span>8320.5</span>
                                </div>
                                <div className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2">
                                    <span>Dollar</span>
                                    <span>1450.0 $</span>
                                </div>
                                <div className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2">
                                    <span>Rial</span>
                                    <span>1,000,000,000</span>
                                </div>
                            </div>

                            {/* Donut Placeholder */}
                            <div className="w-[120px] h-[120px] rounded-full border border-muted/40 flex items-center justify-center text-muted-foreground text-xs">
                                Chart
                            </div>
                        </div>
                    </div>

                </Card>
            </Glass>
        </section>
    )
}

export default Balance
