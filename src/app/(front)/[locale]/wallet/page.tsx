import { getWallets } from "@/api/wallet/action";
import Deposit from "@/components/wallet/deposit/deposit";
import Withdrawal from "@/components/wallet/withdrawal/withdrawal";
import Transfer from "@/components/wallet/transfer/transfer";
import Balance from "@/components/wallet/balance/balance";
import Report from "@/components/wallet/report/report";
import { getCurrencies } from "@/api/currency/action";
export default async function Wallet() {
  try {
    const currencies = await getCurrencies();
    const wallets = await getWallets();
    return (
      <div className="w-full h-full min-h-11/12">
        {/* mobile: vertical stack */}
        <div className="flex sm:hidden">
          <Deposit className="" currencies={currencies} />
          <Withdrawal className="" currencies={currencies} />
          <Transfer className="" currencies={currencies} />
          <Balance className="" currencies={currencies} wallets={wallets} />
          <Report className="" currencies={currencies} />
        </div>

        {/* tablet: md layout */}
        <div className="hidden md:flex lg:hidden">
          <Deposit className="" currencies={currencies} />
          <Withdrawal className="" currencies={currencies} />
          <Transfer className="" currencies={currencies} />
          <Balance className="" currencies={currencies} wallets={wallets} />
          <Report className="" currencies={currencies} />
        </div>

        {/* desktop: lg and bigger layout */}
        <div className="hidden lg:flex w-full h-full justify-center items-center">
          <div className="w-fit min-w-10/12 max-w-11/12 min-h-10/12 max-h-11/12 grid grid-cols-3 grid-rows-3 gap-5">
            <Deposit className="col-span-1 row-span-1" currencies={currencies} />
            <Withdrawal className="col-span-1 row-span-1" currencies={currencies} />
            <Transfer className="col-span-1 row-span-1" currencies={currencies} />
            <Balance className="col-span-1 row-span-2" currencies={currencies} wallets={wallets} />
            <Report className="col-span-2 row-span-2" currencies={currencies} />
          </div>
        </div>

      </div>
    );
  } catch (error) {
    console.error("[WALLET_PAGE]", error);
    return (
      <div className="w-full h-full flex justify-center items-center">
        Internal server error
      </div>
    );
  }
}
