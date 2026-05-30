import { getCurrencies } from "@/api/currency/action";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const t = await getTranslations("LiquidityPool");

    const currencies = await getCurrencies();

    return (
      <div className="w-full">
        <div className="container mx-auto px-5 py-8 grid grid-cols-12 gap-6">
          <div className="col-span-3 bg-card rounded-xl flex flex-col gap-2 px-6 py-4">
            <span className="text-sm text-muted-foreground">
              {t("currencies")}
            </span>
            {currencies.map((currency) => (
              <Link
                key={currency.id}
                href={"/liquidity-pool?currencyId=" + currency.id}
              >
                <Button variant="outline" className="w-full justify-start">
                  {currency.code + " (" + currency.symbol + ")"}
                </Button>
              </Link>
            ))}
          </div>
          <div className="col-span-9 bg-card p-5 rounded-2xl">{children}</div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("[LIQUIDITY_POOL_LAYOUT]", error);
    return <div>Internal server error</div>;
  }
}
