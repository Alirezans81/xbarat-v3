"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { LiquidityPool } from "@/types/front/liquidityPool";
import { ColumnDef } from "@tanstack/react-table";

export const liquidityPoolColumns: ColumnDef<LiquidityPool>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user.fullName",
    header: "User",
  },
  {
    accessorKey: "currency.code",
    header: "Currency",
  },
  {
    accessorKey: "paymentChannel.name",
    header: "Payment Channel",
  },
  {
    accessorKey: "balance",
    header: "Amount",
  },
];
