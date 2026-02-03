import { getWallets } from "@/api/wallet/action";
import WalletTable from "@/components/wallet/wallet-table";

export default async function Wallet() {
  const data = await getWallets();

  return (
    <div className="w-full h-full flex flex-col gap-3 bg-card rounded-xl p-5">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="text-3xl">Wallet</span>
        </div>
      </div>

      <WalletTable data={data} />
    </div>
  );
}
