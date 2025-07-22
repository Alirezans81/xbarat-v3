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
import { BridgeTransfer } from "../../types/bridgeTransfer";
import { useTranslations } from "next-intl";

interface Props {
  data: BridgeTransfer[];
}
export default function PaymentsTable({ data }: Props) {
  const t = useTranslations("LiquidityPool");

  return (
    <Table>
      <TableCaption>{t("paymentTableFooter")}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-start">{t("type")}</TableHead>
          <TableHead className="text-start">{t("amount")}</TableHead>
          <TableHead className="text-start">{t("from")}</TableHead>
          <TableHead className="text-start">{t("to")}</TableHead>
          <TableHead className="text-start">{t("status")}</TableHead>
          <TableHead className="text-end"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((bridgeTransfer) => (
          <TableRow key={bridgeTransfer.id}>
            <TableCell>
              {bridgeTransfer.depositId
                ? t("deposit")
                : bridgeTransfer.withdrawalId
                ? t("withdrawal")
                : "Error"}
            </TableCell>
            <TableCell>
              {bridgeTransfer.depositId
                ? (+bridgeTransfer.amount).toLocaleString() +
                  " " +
                  bridgeTransfer.deposit?.wallet.currency.symbol
                : bridgeTransfer.withdrawalId
                ? (+bridgeTransfer.amount).toLocaleString() +
                  " " +
                  bridgeTransfer.withdrawal?.wallet.currency.symbol
                : "Error"}
            </TableCell>
            <TableCell>
              {bridgeTransfer.deposit
                ? "User"
                : bridgeTransfer.withdrawal
                ? bridgeTransfer.liquidityPool?.address
                : "Error"}
            </TableCell>
            <TableCell>
              {bridgeTransfer.deposit
                ? bridgeTransfer.liquidityPool?.address
                : bridgeTransfer.withdrawal
                ? bridgeTransfer.withdrawal.receiverAddress +
                  " (" +
                  bridgeTransfer.withdrawal.addressOwnerName +
                  ")"
                : "Error"}
            </TableCell>
            <TableCell>{bridgeTransfer.status}</TableCell>
            <TableCell className="flex justify-end"></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
