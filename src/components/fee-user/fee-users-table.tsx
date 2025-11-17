import { FeeUser } from "@/types/front/feeUser";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteFeeUserDialog from "../dialog/fee-user/delete-fee-user-dialog";
import ActiveFeeUserDialog from "../dialog/fee-user/active-fee-user";

interface Props {
  data: FeeUser[];
}
export default function FeeUsersTable({ data }: Props) {
  return (
    <Table>
      <TableCaption>List of fee users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User Email</TableHead>
          <TableHead>User Fullname</TableHead>
          <TableHead>Active</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((feeUser) => (
          <TableRow key={feeUser.id}>
            <TableCell>{feeUser.user.email}</TableCell>
            <TableCell>{feeUser.user.fullName}</TableCell>
            <TableCell>{feeUser.isActive ? "Yes" : "No"}</TableCell>
            <TableCell className="flex justify-end">
              {!feeUser.isActive && (
                <ActiveFeeUserDialog feeUser_id={feeUser.id} />
              )}
              <DeleteFeeUserDialog feeUser_id={feeUser.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
