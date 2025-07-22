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
import { PaymentChannel } from "@/types/front/paymentChannel";
import EditPaymentChannelDialog from "../dialog/payment-channel/edit-payment-channel-dialog";
import DeletePaymentChannelDialog from "../dialog/payment-channel/delete-payment-channel-dialog";

interface Props {
  data: PaymentChannel[];
}
export default function PaymentChannelsTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>List of payment channels.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((paymentChannel) => (
          <TableRow key={paymentChannel.id}>
            <TableCell className="font-medium">{paymentChannel.name}</TableCell>
            <TableCell>{paymentChannel.description || "-"}</TableCell>
            <TableCell>
              {new Date(paymentChannel.createdAt).toISOString()}
            </TableCell>
            <TableCell className="flex justify-end">
              <EditPaymentChannelDialog data={paymentChannel} />
              <DeletePaymentChannelDialog
                paymentChannel_id={paymentChannel.id}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
