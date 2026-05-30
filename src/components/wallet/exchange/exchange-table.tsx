"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Exchange } from "@/types/front/wallet/exchange";

interface Props {
  data: Exchange[];
}
export default function ExchangeTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>List of exchanges.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Receive Amount</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((exchange) => (
          <TableRow key={exchange.id}>
            <TableCell className="font-medium">
              {exchange.currencyPair.fromCurrency.code}
            </TableCell>
            <TableCell className="font-medium">
              {exchange.currencyPair.toCurrency.code}
            </TableCell>
            <TableCell>
              {exchange.currencyPair.fromCurrency.symbol +
                " " +
                (+exchange.fromAmount).toLocaleString()}
            </TableCell>
            <TableCell>
              {exchange.toAmount
                ? exchange.currencyPair.toCurrency.symbol +
                  " " +
                  (+exchange.toAmount).toLocaleString()
                : "N/A"}
            </TableCell>
            <TableCell>{(+exchange.exchangeRate).toLocaleString()}</TableCell>
            <TableCell className="text-destructive">
              {"- " +
                exchange.currencyPair.fromCurrency.symbol +
                " " +
                (+exchange.fromAmount).toLocaleString()}
            </TableCell>
            <TableCell>
              {new Date(exchange.createdAt).toDateString() +
                " " +
                new Date(exchange.createdAt).toTimeString().split(" ")[0]}
            </TableCell>
            <TableCell
              className={`
                ${exchange.status === "PENDING" && "text-secondary"}
                ${exchange.status === "PARTIAL" && "text-secondary"}
                ${exchange.status === "COMPLETED" && "text-chart-2"}
                ${exchange.status === "FAILED" && "text-destructive"}
                ${exchange.status === "CANCELED" && "text-destructive"}
                `}
            >
              {exchange.status}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              {exchange.status === "PENDING" && (
                <>
                  {/* <EditExchangeDialog data={exchange} /> */}
                  {/* <DeleteExchangeDialog exchange_id={exchange.id} /> */}
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
