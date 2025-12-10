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
import { addComma } from "@/lib/front/utils/number";
import { useGetLastExchanges } from "@/api/wallet/exchange/hooks";

import { CurrencyPair } from "@/types/front/currencyPair";
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

    const [orderBooks, setOrderBooks] = useState<(Exchange & { count: Number })[] | null>([]);
    const [reverseOrderBooks, setReverseOrderBooks] = useState<(Exchange & { count: Number })[] | null>([]);

    const [_, setLoading] = useState<boolean>(false);

    const getOrders = useGetLastExchanges();
    const getReverseOrders = useGetLastExchanges();

    useEffect(() => {
        setOrderBooks([]);
        setReverseOrderBooks([]);
        if (!currencyPair?.id) {
            return;
        }
        setLoading(true);
        const fetchOrderBooks = async () => {
            try {
                await getOrders({
                    currencyPairId: currencyPair.id,
                    setOrderBooks: setOrderBooks,
                });

            } catch (error) {
                console.error('Error fetching order books:', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchReverseOrderBooks = async () => {
            try {
                if (reverseCurrencyPair?.id) {
                    await getReverseOrders({ currencyPairId: reverseCurrencyPair.id, setOrderBooks: setReverseOrderBooks });
                } else {
                    setReverseOrderBooks([]);
                }
            }
            catch (error) {
                console.error('Error fetching order books:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrderBooks();
        fetchReverseOrderBooks();
        setLoading(false);

    }, [currencyPair?.id, reverseCurrencyPair?.id]);

    const fromCurr = currencyPair?.fromCurrency.code;
    const toCurr = currencyPair?.toCurrency.code;

    return (
        <div className="w-full h-fit flex flex-row gap-x-5 justify-center items-start mt-14">
            <div className={`w-1/4 h-72 rounded-2xl p-3 bg-green-950 ${fromCurr === undefined || toCurr === undefined ? "hidden" : ""}`}>
                <Table>
                    <TableCaption>{`List of all ${fromCurr + "/" + toCurr} Order Books`}</TableCaption>
                    <TableHeader >
                        <TableRow>
                            <TableHead className="text-chart-2 font-bold">
                                Quantity
                            </TableHead>
                            <TableHead className="text-chart-2 font-bold">
                                Amount
                            </TableHead>
                            <TableHead className="text-chart-2 font-bold">
                                Rate
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderBooks !== null && orderBooks.length !== 0 && orderBooks
                            .sort((a, b) => parseFloat(a.exchangeRate.toString()) - parseFloat(b.exchangeRate.toString())).map((order: (Exchange & { count: Number }), index: number) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center">{order.count.toString()}</TableCell>
                                    <TableCell className="font-medium text-center">{addComma(order.fromAmount)}</TableCell>
                                    <TableCell className="font-medium text-center">{addComma(order.exchangeRate)}</TableCell>

                                </TableRow>
                            ))}
                    </TableBody>
                </Table >
            </div>
            <div className={`w-1/4 h-72 rounded-2xl p-3 bg-red-950 ${fromCurr === undefined || toCurr === undefined ? "hidden" : ""}`}>
                <Table>
                    <TableCaption>{`List of all ${toCurr + "/" + fromCurr} Order Books`}</TableCaption>
                    <TableHeader >
                        <TableRow>
                            <TableHead className="text-chart-5 font-bold">
                                Rate
                            </TableHead>
                            <TableHead className="text-chart-5 font-bold">
                                Amount
                            </TableHead>
                            <TableHead className="text-chart-5 font-bold">
                                Quantity
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reverseOrderBooks !== null && reverseOrderBooks.length !== 0 && reverseOrderBooks
                            .sort((a, b) => parseFloat(a.exchangeRate.toString()) - parseFloat(b.exchangeRate.toString())).map((order: (Exchange & { count: Number }), index: number) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center">{addComma(order.exchangeRate)}</TableCell>
                                    <TableCell className="font-medium text-center">{addComma(order.fromAmount)}</TableCell>
                                    <TableCell className="font-medium text-center">{order.count.toString()}</TableCell>

                                </TableRow>
                            ))}
                    </TableBody>
                </Table >
            </div>
        </div >
    );
}