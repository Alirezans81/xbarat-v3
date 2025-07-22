"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Withdrawal } from "@/types/front/wallet/withdrawal";
import { ColumnDef } from "@tanstack/react-table";

export const withdrawalColumns: ColumnDef<Withdrawal>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "paymentChannel.name",
    header: "Payment Channel",
  },
  {
    accessorKey: "wallet.currency.code",
    header: "Currency",
  },
  {
    accessorKey: "user.fullName",
    header: "User",
  },
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
];
