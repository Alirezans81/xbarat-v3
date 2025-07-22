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
import { Wallet } from "@/types/front/wallet";
import AddWalletDepositDialog from "../dialog/wallet/deposit/add-wallet-deposit-dialog";
import AddWithdrawalDialog from "../dialog/wallet/withdrawal/add-withdrawal-dialog";
import AddTransferDialog from "../dialog/wallet/transfer/add-transfer-dialog";

interface Props {
  data: Wallet[];
}
export default function WalletTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>List of wallets.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Currency</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Frozen</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((wallet) => (
          <TableRow key={wallet.id}>
            <TableCell className="font-medium">
              {wallet.currency.code}
            </TableCell>
            <TableCell>
              {wallet.currency.symbol + " " + wallet.balance}
            </TableCell>
            <TableCell>
              {wallet.currency.symbol + " " + wallet.frozen}
            </TableCell>
            <TableCell>
              {new Date(wallet.createdAt).toDateString() +
                " " +
                new Date(wallet.createdAt).toTimeString().split(" ")[0]}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              <AddWalletDepositDialog
                currency={wallet.currency}
                walletId={wallet.id}
              />
              <AddWithdrawalDialog />
              <AddTransferDialog />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
