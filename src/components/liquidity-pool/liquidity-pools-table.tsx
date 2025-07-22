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
import { LiquidityPool } from "@/types/liquidityPool";
import DeleteLiquidityPoolDialog from "../dialog/liquidity-pool/delete-liquidity-pool-dialog";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface Props {
  data: LiquidityPool[];
}
export default function LiquidityPoolsTable({ data }: Props) {
  const t = useTranslations("LiquidityPool");

  return (
    <Table>
      <TableCaption>{t("tableFooter")}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-start">{t("address")}</TableHead>
          <TableHead className="text-start">{t("balance")}</TableHead>
          <TableHead className="text-start">{t("frozen")}</TableHead>
          <TableHead className="text-start">{t("updatedAt")}</TableHead>
          <TableHead className="text-end"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((liquidityPool) => (
          <TableRow key={liquidityPool.id}>
            <TableCell>{liquidityPool.address}</TableCell>
            <TableCell>
              {liquidityPool.balance + " " + liquidityPool.currency.symbol}
            </TableCell>
            <TableCell>
              <span className="!text-destructive">{+liquidityPool.frozen}</span>
              {" " + liquidityPool.currency.symbol}
            </TableCell>
            <TableCell>
              {new Date(liquidityPool.updatedAt).toISOString()}
            </TableCell>
            <TableCell className="flex justify-end">
              {/* <EditPaymentChannelDialog data={liquidityPool} /> */}
              <Link href={`/liquidity-pool/${liquidityPool.id}/payments`}>
                <Button className="text-white">{t("payments")}</Button>
              </Link>
              <DeleteLiquidityPoolDialog liquidityPool_id={liquidityPool.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
