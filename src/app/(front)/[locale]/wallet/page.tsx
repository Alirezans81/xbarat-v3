import { getWallets } from "@/api/wallet/action";
import Deposit from "@/components/wallet/deposit/deposit";
import Withdrawal from "@/components/wallet/withdrawal/withdrawal";
import Transfer from "@/components/wallet/transfer/transfer";
import Balance from "@/components/wallet/balance/balance";
import Report from "@/components/wallet/report/report";
import MobileComponentModalOpener from "@/components/wallet/mobile-component-model-opener";
import { getCurrencies } from "@/api/currency/action";

export default async function Wallet() {
  const [currenciesResult, walletsResult] = await Promise.allSettled([
    getCurrencies(),
    getWallets(),
  ]);

  if (currenciesResult.status === "rejected" || walletsResult.status === "rejected") {
    console.error("[WALLET_PAGE]", {
      currenciesError: currenciesResult.status === "rejected" ? currenciesResult.reason : null,
      walletsError: walletsResult.status === "rejected" ? walletsResult.reason : null,
    });
    return (
      <div className="w-full h-full flex justify-center items-center">
        Internal server error
      </div>
    );
  }

  const currencies = currenciesResult.value;
  const wallets = walletsResult.value;

  return (
    <div className="w-full h-full min-h-11/12">
      {/* mobile: vertical stack */}
      <div className="flex sm:hidden flex-col w-full h-full justify-center items-center pt-10 gap-y-5 px-5">
        <MobileComponentModalOpener
          className={"w-full h-fit flex flex-col justify-center items-center gap-y-3"}
          currencies={currencies}
        />
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
}
