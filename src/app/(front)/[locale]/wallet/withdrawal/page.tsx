import { getWithdrawals } from "@/api/wallet/withdrawal/action";
import AddWithdrawalDialog from "@/components/dialog/wallet/withdrawal/add-withdrawal-dialog";
import WithdrawalTable from "@/components/wallet/withdrawal/withdrawal-table";

export default async function Page() {
  const data = await getWithdrawals();

  return (
    <div className="w-full h-full flex flex-col gap-3 bg-card rounded-xl p-5">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="text-3xl">Withdrawal</span>
        </div>
        <AddWithdrawalDialog />
      </div>

      <WithdrawalTable data={data} />
    </div>
  );
}
