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
import { CurrencyPair } from "@/types/front/currencyPair";
import EditCurrencyPairDialog from "../dialog/currency-pair/edit-currency-pair-dialog";
import DeleteCurrencyPairDialog from "../dialog/currency-pair/delete-currency-pair-dialog";

interface Props {
  data: CurrencyPair[];
}
export default function CurrencyPairsTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>List of currency pairs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Inverse Rate</TableHead>
          <TableHead>Active</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((currencyPair) => (
          <TableRow key={currencyPair.id}>
            <TableCell className="font-medium">
              {currencyPair.fromCurrency.code}
            </TableCell>
            <TableCell>{currencyPair.toCurrency.code}</TableCell>
            <TableCell>{(+currencyPair.rate).toLocaleString()}</TableCell>
            <TableCell>
              {new Date(currencyPair.createdAt).toISOString()}
            </TableCell>
            <TableCell>{currencyPair.isInverseRate ? "Yes" : "No"}</TableCell>
            <TableCell>{currencyPair.isActive ? "Yes" : "No"}</TableCell>

            <TableCell className="flex justify-end">
              <EditCurrencyPairDialog data={currencyPair} />
              <DeleteCurrencyPairDialog currencyPair_id={currencyPair.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
