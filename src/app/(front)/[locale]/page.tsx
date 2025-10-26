import { getCurrencyPairs } from "@/api/currency-pair/action";
import { getCurrencies } from "@/api/currency/action";
import { getWallets } from "@/api/wallet/action";
import ExchangeForm from "@/components/home/ExchangeForm";

export default async function Home() {
  const { data: currencies } = await getCurrencies();
  const { data: currencyPairs } = await getCurrencyPairs();
  const { data: wallets } = await getWallets();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-8 py-36 container mx-auto px-5">
      <span className="capitalize text-6xl font-bold">
        when you are enough!
      </span>
      <ExchangeForm
        currencies={currencies}
        currencyPairs={currencyPairs}
        wallets={wallets}
      />
    </div>
  );
}
