import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { useGetLastExchanges } from "@/api/wallet/exchange/hooks";

import { CurrencyPair } from "@/types/back/currencyPair";
import { Exchange } from "@/types/back/wallet/exchange";

interface Props {
    currencyPair: CurrencyPair | null
    currencyPairs: CurrencyPair[] | null
}

export default function OrderBook({ currencyPair, currencyPairs }: Props) {
    const reverseCurrencyPair = currencyPairs?.find(
        (pair) => pair.fromCurrencyId === currencyPair?.toCurrencyId &&
            pair.toCurrencyId === currencyPair?.fromCurrencyId
    );

    const [orderBooks, setOrderBooks] = useState<Exchange[] | null>([]);
    const [reverseOrderBooks, setReverseOrderBooks] = useState<Exchange[] | null>([]);

    const [_, setLoading] = useState<Boolean>(false);

    const getOrders = useGetLastExchanges();
    useEffect(() => {
        if (!currencyPair?.id) return;

        setLoading(true);
        getOrders({
            currencyPairId: currencyPair.id,
            setOrderBooks: setOrderBooks,
        });
        if (reverseCurrencyPair) {
            getOrders({
                currencyPairId: reverseCurrencyPair.id,
                setOrderBooks: setReverseOrderBooks,
            });
        }
        setLoading(false);

    }, [currencyPair?.id]);

    return (
        <Table>
            <TableCaption>List of all Order Books</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orderBooks !== null && orderBooks.map((order: Exchange, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{order.currencyPair.fromCurrency.code}</TableCell>
                        <TableCell className="font-medium">{order.currencyPair.fromCurrency.code}</TableCell>
                        <TableCell className="font-medium">{order.currencyPair.fromCurrency.code}</TableCell>
                        <TableCell className="font-medium">{order.currencyPair.fromCurrency.code}</TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}