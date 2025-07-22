import { getDeposits } from "@/api/wallet/deposit/action";
import AddDepositDialog from "@/components/dialog/wallet/deposit/add-deposit-dialog";
import DepositTable from "@/components/wallet/deposit/deposit-table";

export default async function page() {
  try {
    const { data } = await getDeposits();

    return (
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-3xl">Deposit</span>
          </div>
          <AddDepositDialog />
        </div>

        <DepositTable data={data} />
      </div>
    );
  } catch (error) {
    console.error("[DEPOSIT_PAGE]", error);
    return (
      <div className="w-full h-full flex justify-center items-center">
        Internal server error
      </div>
    );
  }
}
