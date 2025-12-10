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
    currencyPairs: CurrencyPair[] | null,
    setRate: (numRate: string) => void;
}

export default function OrderBook({ currencyPair, currencyPairs, setRate }: Props) {
    const reverseCurrencyPair = currencyPairs?.find(
        (pair) => pair.fromCurrencyId === currencyPair?.toCurrencyId &&
            pair.toCurrencyId === currencyPair?.fromCurrencyId
    );

    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
        <div id="latest-table" className={`w-full h-fit ${orderBooks === null || orderBooks.length == 0 ? "hidden" : "flex"} flex-col mt-24 items-center gap-y-5`}>
            <span className="w-fit h-fit text-white text-2xl">Lastest Transactions</span>
            <div className="w-full h-full flex flex-row gap-x-5 justify-center items-start">


                {/* First Table */}
                <div className="w-fit h-fit flex flex-col gap-y-2">
                    <span className="text-[#1D5E04] flex justify-center text-3xl">Buy</span>
                    <div className={`w-full h-fit rounded-2xl p-3 bg-[#0D0D0D] ${fromCurr === undefined || toCurr === undefined ? "hidden" : ""}`}>
                        <Table>
                            <TableCaption>{`List of all ${fromCurr + "/" + toCurr} Order Books`}</TableCaption>
                            <TableHeader >
                                <TableRow>
                                    <TableHead className="text-[#4B4D4E] text-center">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="text-[#4B4D4E] text-center w-36">
                                        Amount
                                    </TableHead>
                                    <TableHead className="text-[#4B4D4E] text-center w-24">
                                        Rate
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderBooks !== null && orderBooks.length !== 0 && orderBooks
                                    .sort((a, b) => parseFloat(a.exchangeRate.toString()) - parseFloat(b.exchangeRate.toString())).map((order: (Exchange & { count: Number }), index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium text-center">
                                                <div className="w-12 h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#060606] to-[#282828] shadow-[0_0_5px_0.1px_#1D5E04]">
                                                    {order.count.toString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-center">
                                                <div className="w-full h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#060606] to-[#282828] shadow-[0_0_5px_0.1px_#1D5E04]">
                                                    {addComma(order.fromAmount)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-center">
                                                <button onClick={() => {
                                                    setRate(order.exchangeRate.toString())
                                                    scrollToTop();
                                                }}
                                                    className="w-full h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#060606] to-[#282828] shadow-[0_0_5px_0.1px_#1D5E04] hover:bg-gradient-to-br hover:from-accent hover:to-muted hover:cursor-pointer">
                                                    {addComma(order.exchangeRate)}
                                                </button>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table >
                    </div>
                </div>



                {/* Second Table */}
                <div className="w-fit h-fit flex flex-col gap-y-2">
                    <span className="text-[#860303] flex justify-center text-3xl">Sell</span>
                    <div className={`w-full h-fit rounded-2xl p-3 bg-[#0D0D0D] ${fromCurr === undefined || toCurr === undefined ? "hidden" : ""}`}>
                        <Table>
                            <TableCaption>{`List of all ${fromCurr + "/" + toCurr} Order Books`}</TableCaption>
                            <TableHeader >
                                <TableRow>
                                    <TableHead className="text-[#4B4D4E] text-center">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="text-[#4B4D4E] text-center w-36">
                                        Amount
                                    </TableHead>
                                    <TableHead className="text-[#4B4D4E] text-center w-24">
                                        Rate
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reverseOrderBooks !== null && reverseOrderBooks.length !== 0 && reverseOrderBooks
                                    .sort((a, b) => parseFloat(a.exchangeRate.toString()) - parseFloat(b.exchangeRate.toString())).map((order: (Exchange & { count: Number }), index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium text-center">
                                                <div className="w-12 h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#060606] to-[#282828] shadow-[0_0_5px_0.1px_#860303]">
                                                    {order.count.toString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-center">
                                                <div className="w-full h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#060606] to-[#282828] shadow-[0_0_5px_0.1px_#860303]">
                                                    {addComma(order.fromAmount)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-center bg-transparent">
                                                <button onClick={() => {
                                                    setRate(order.exchangeRate.toString())
                                                    scrollToTop();
                                                }} className="w-full h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#060606] to-[#282828] shadow-[0_0_5px_0.1px_#860303] hover:bg-gradient-to-br hover:from-accent hover:to-muted hover:cursor-pointer">
                                                    {addComma(order.exchangeRate)}
                                                </button>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table >
                    </div>
                </div>
            </div >
        </div >
    );
}