import { getCurrencyPairs } from "@/api/currency-pair/action";
import { getCurrencies } from "@/api/currency/action";
import { getWallets } from "@/api/wallet/action";
import ExchangeForm from "@/components/home/ExchangeForm";

export default async function Home() {
  try {
    const currencies = await getCurrencies();
    const currencyPairs = await getCurrencyPairs();

    try {
      const wallets = await getWallets();

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
    } catch (error) {
      return (
        <div className="w-full flex flex-col justify-center items-center gap-8 py-36 container mx-auto px-5">
          <span className="capitalize text-6xl font-bold">
            when you are enough!
          </span>
          <ExchangeForm
            currencies={currencies}
            currencyPairs={currencyPairs}
            wallets={[]}
          />
        </div>
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="w-full flex flex-col justify-center items-center gap-8 py-36 container mx-auto px-5">
        <span className="capitalize text-6xl font-bold">
          Something went wrong!
        </span>
      </div>
    );
  }
}
