"use client";

import DeleteWithdrawalDialog from "@/components/dialog/wallet/withdrawal/delete-withdrawal-dialog";
import ApproveWithdrawalDocument from "@/components/dialog/wallet/withdrawal/approve-withdrawal-document";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Withdrawal } from "@/types/front/wallet/withdrawal";

interface Props {
  data: Withdrawal[];
}
export default function WithdrawalTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>List of withdrawals.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Currency</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Receiver Address</TableHead>
          <TableHead>Address Owner Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((withdrawal) => (
          <TableRow key={withdrawal.id}>
            <TableCell className="font-medium">
              {withdrawal.wallet.currency.code}
            </TableCell>
            <TableCell>
              {withdrawal.wallet.currency.symbol + " " + withdrawal.amount}
            </TableCell>
            <TableCell>
              {withdrawal.wallet.currency.symbol + " " + withdrawal.fee}
            </TableCell>
            <TableCell>{withdrawal.receiverAddress}</TableCell>
            <TableCell>{withdrawal.addressOwnerName}</TableCell>
            <TableCell>
              {new Date(withdrawal.createdAt).toDateString() +
                " " +
                new Date(withdrawal.createdAt).toTimeString().split(" ")[0]}
            </TableCell>
            <TableCell
              className={`
                ${withdrawal.status === "PENDING" && "text-secondary"}
                ${withdrawal.status === "COMPLETED" && "text-chart-2"}
                ${withdrawal.status === "FAILED" && "text-destructive"}
                `}
            >
              {withdrawal.status}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              {withdrawal.status === "PENDING" && (
                <>
                  {/* <EditWithdrawalDialog data={withdrawal} /> */}
                  <DeleteWithdrawalDialog withdrawal_id={withdrawal.id} />
                </>
              )}
              {withdrawal.status === "APPROVAL" && (
                <ApproveWithdrawalDocument
                  withdrawal_id={withdrawal.id}
                  document_url={withdrawal.BridgeTransfer?.documentUrl || ""}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
