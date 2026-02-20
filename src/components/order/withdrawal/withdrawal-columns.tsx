"use client";

import { Withdrawal } from "@/types/front/wallet/withdrawal";
import { ColumnDef } from "@tanstack/react-table";
import QuickTicketDialog from "@/components/dialog/ticket/quick-ticket-dialog";

export const withdrawalColumns: ColumnDef<Withdrawal>[] = [
  {
    accessorKey: "user.fullName",
    header: "User",
  },
  {
    accessorKey: "wallet.currency.code",
    header: "Currency",
  },
  {
    accessorKey: "paymentChannel.name",
    header: "Payment Channel",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <QuickTicketDialog
          userEmail={user.email}
          userName={user.fullName}
        />
      );
    },
  },
];
