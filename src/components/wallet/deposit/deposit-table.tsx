"use client";

import DeleteDepositDialog from "@/components/dialog/wallet/deposit/delete-deposit-dialog";
import EditDepositDialog from "@/components/dialog/wallet/deposit/edit-deposit-dialog";
import UploadDepositDocument from "@/components/dialog/wallet/deposit/upload-deposit-document";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Deposit } from "@/types/front/wallet/deposit";

interface Props {
  data: Deposit[];
}
export default function DepositTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>List of deposits.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Currency</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((deposit) => (
          <TableRow key={deposit.id}>
            <TableCell className="font-medium">
              {deposit.wallet.currency.code}
            </TableCell>
            <TableCell>
              {deposit.wallet.currency.symbol + " " + deposit.amount}
            </TableCell>
            <TableCell>
              {deposit.wallet.currency.symbol + " " + deposit.fee}
            </TableCell>
            <TableCell>
              {new Date(deposit.createdAt).toDateString() +
                " " +
                new Date(deposit.createdAt).toTimeString().split(" ")[0]}
            </TableCell>
            <TableCell
              className={`
                ${deposit.status === "COMPLETED" && "text-chart-2"}
                ${deposit.status === "PAYMENT" && "text-secondary"}
                ${deposit.status === "FAILED" && "text-destructive"}
                `}
            >
              {deposit.status}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              {deposit.status === "PENDING" && (
                <>
                  <EditDepositDialog data={deposit} />
                  <DeleteDepositDialog deposit_id={deposit.id} />
                </>
              )}
              {deposit.status === "PAYMENT" && (
                <UploadDepositDocument deposit_id={deposit.id} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
