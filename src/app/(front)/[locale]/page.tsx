import { getCurrencyPairs } from "@/api/currency-pair/action";
import { getCurrencies } from "@/api/currency/action";
import { getWallets } from "@/api/wallet/action";
import Exchange from "@/components/home/exchange/exchange";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  let currencies;
  let currencyPairs;
  let wallets;
  let error = false;
  const t = await getTranslations("HomePage");
  try {
    currencies = await getCurrencies();
    currencyPairs = await getCurrencyPairs();
  } catch (err) {
    console.error("Error fetching data:", err);
    error = true;
  }

  try {
    wallets = await getWallets();
  } catch (err) {
    console.error("Error fetching data:", err);
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-8 py-64 container mx-auto px-5">
        <span className="capitalize text-6xl font-bold">{t("slogan")}</span>
      </div>
    );
  }

  if (currencies && currencyPairs) {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-8 py-12 md:py-16 lg:py-20 container mx-auto px-5">
        <span className="capitalize text-4xl sm:text-5xl xl:text-6xl font-bold text-center">
          {t("slogan")}
        </span>
        <Exchange
          currencies={currencies}
          currencyPairs={currencyPairs}
          wallets={wallets || []}
        />
      </div>
    );
  }
}
