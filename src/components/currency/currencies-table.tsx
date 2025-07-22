"use client";

import { Currency } from "@/types/front/currency";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditCurrencyDialog from "../dialog/currency/edit-currency-dialog";
import DeleteCurrencyDialog from "../dialog/currency/delete-currency-dialog";

interface Props {
  data: Currency[];
}
export default function CurrenciesTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>List of currencies.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Decimals</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Paymnet Channels</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((currency) => (
          <TableRow key={currency.id}>
            <TableCell className="font-medium">{currency.name}</TableCell>
            <TableCell>{currency.code}</TableCell>
            <TableCell>{currency.symbol}</TableCell>
            <TableCell>{currency.decimals}</TableCell>
            <TableCell>{new Date(currency.createdAt).toISOString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {currency.paymentChannels.map((e, i) => (
                  <span key={e.id}>
                    {e.name +
                      (i !== currency.paymentChannels.length - 1 ? " - " : "")}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell className="flex justify-end">
              <EditCurrencyDialog data={currency} />
              <DeleteCurrencyDialog currency_id={currency.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
