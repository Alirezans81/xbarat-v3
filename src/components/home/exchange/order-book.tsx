import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { addComma } from "@/lib/front/utils/number";
import { useGetLastExchanges } from "@/api/wallet/exchange/hooks";

import { CurrencyPair } from "@/types/front/currencyPair";
import { Exchange } from "@/types/back/wallet/exchange";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  currencyPair: CurrencyPair | null;
  currencyPairs: CurrencyPair[] | null;
  setRate: (numRate: number) => void;
}

export default function OrderBook({
  currencyPair,
  currencyPairs,
  setRate,
}: Props) {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [orderBooks, setOrderBooks] = useState<
    (Exchange & { count: number })[] | null
  >([]);
  const [reverseOrderBooks, setReverseOrderBooks] = useState<
    (Exchange & { count: number })[] | null
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const getOrders = useGetLastExchanges();
  const getReverseOrders = useGetLastExchanges();

  const resetOrderBooks = useCallback(() => {
    setOrderBooks([]);
    setReverseOrderBooks([]);
  }, []);
  const fetchOrderBooks = useCallback(async () => {
    if (currencyPair) {
      try {
        setLoading(true);
        await getOrders({
          currencyPairId: currencyPair.id,
          setOrderBooks: setOrderBooks,
        });

        const reverseCurrencyPair = currencyPairs?.find(
          (pair) =>
            pair.fromCurrencyId === currencyPair?.toCurrencyId &&
            pair.toCurrencyId === currencyPair?.fromCurrencyId
        );

        if (reverseCurrencyPair) {
          await getReverseOrders({
            currencyPairId: reverseCurrencyPair.id,
            setOrderBooks: setReverseOrderBooks,
          });
        }
      } catch (error) {
        console.error("Error fetching order books:", error);
      } finally {
        setLoading(false);
      }
    } else {
      resetOrderBooks();
    }
  }, [currencyPair, currencyPairs, getOrders, getReverseOrders, resetOrderBooks]);
  useEffect(() => {
    fetchOrderBooks();
  }, [fetchOrderBooks]);

  const fromCurr = currencyPair?.fromCurrency.code;
  const toCurr = currencyPair?.toCurrency.code;

  return (
    <div
      id="latest-table"
      className={`w-full h-fit ${
        currencyPair ? "flex" : "hidden"
      } flex-col items-center gap-y-8`}
    >
      <span className="w-fit h-fit text-foreground text-3xl">
        Latest Transactions
      </span>
      <div className="w-full h-full flex flex-col-reverse sm:flex-row gap-x-5 justify-center items-center">
        {/* First Table */}
        <div className="w-fit h-fit flex flex-col gap-y-4 !mt-5 sm:mt-0">
          <span className="text-wine flex justify-center text-3xl">Sell</span>
          <div
            className={`w-full h-fit rounded-2xl p-3 bg-card backdrop-blur-sm`}
          >
            <Table>
              <TableCaption>{`List of all ${
                fromCurr + " -> " + toCurr
              } Order Books`}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted text-center">
                    Quantity
                  </TableHead>
                  <TableHead className="text-muted text-center w-36">
                    Amount
                  </TableHead>
                  <TableHead className="text-muted text-center w-24">
                    Rate
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Spinner className="mx-auto text-primary/70 w-8 h-8" />
                    </TableCell>
                  </TableRow>
                ) : (
                  orderBooks !== null &&
                  orderBooks.length !== 0 &&
                  orderBooks
                    .sort(
                      (a, b) =>
                        parseFloat(a.exchangeRate.toString()) -
                        parseFloat(b.exchangeRate.toString())
                    )
                    .map(
                      (order: Exchange & { count: number }, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-center">
                            <div className="w-12 h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-from-background to-to-background shadow-[0_0_12px_-4px] !shadow-wine">
                              {order.count.toString()}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            <div className="w-full h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-from-background to-to-background shadow-[0_0_12px_-4px] !shadow-wine">
                              {addComma(order.fromAmount)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            <button
                              onClick={() => {
                                setRate(+order.exchangeRate);
                                scrollToTop();
                              }}
                              className="w-full h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-from-background to-to-background shadow-[0_0_12px_-4px] !shadow-wine hover:bg-gradient-to-br hover:from-accent hover:to-muted hover:cursor-pointer"
                            >
                              {addComma(order.exchangeRate)}
                            </button>
                          </TableCell>
                        </TableRow>
                      )
                    )
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Second Table */}
        <div className="w-fit h-fit flex flex-col gap-y-4">
          <span className="text-green flex justify-center text-3xl">Buy</span>
          <div
            className={`w-full h-fit rounded-2xl p-3 bg-card backdrop-blur-sm`}
          >
            <Table>
              <TableCaption>{`List of all ${
                toCurr + " -> " + fromCurr
              } Order Books`}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted text-center">
                    Quantity
                  </TableHead>
                  <TableHead className="text-muted text-center w-36">
                    Amount
                  </TableHead>
                  <TableHead className="text-muted text-center w-24">
                    Rate
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Spinner className="mx-auto text-primary/70 w-8 h-8" />
                    </TableCell>
                  </TableRow>
                ) : (
                  reverseOrderBooks !== null &&
                  reverseOrderBooks.length !== 0 &&
                  reverseOrderBooks
                    .sort(
                      (a, b) =>
                        parseFloat(a.exchangeRate.toString()) -
                        parseFloat(b.exchangeRate.toString())
                    )
                    .map(
                      (order: Exchange & { count: number }, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-center">
                            <div className="w-12 h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-from-background to-to-background shadow-[0_0_12px_-4px] !shadow-green">
                              {order.count.toString()}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            <div className="w-full h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-from-background to-to-background shadow-[0_0_12px_-4px] !shadow-green">
                              {addComma(order.fromAmount)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-center bg-transparent">
                            <button
                              onClick={() => {
                                setRate((+order.exchangeRate));
                                scrollToTop();
                              }}
                              className="w-full h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-from-background to-to-background shadow-[0_0_12px_-4px] !shadow-green hover:bg-gradient-to-br hover:from-accent hover:to-muted hover:cursor-pointer"
                            >
                              {addComma(order.exchangeRate)}
                            </button>
                          </TableCell>
                        </TableRow>
                      )
                    )
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
