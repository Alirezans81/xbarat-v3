import { getCurrencyById } from "@/api/currency/action";
import AddLiquidityPoolDialog from "@/components/dialog/liquidity-pool/add-liquidity-pool-dialog";
import LiquidityPoolsTable from "@/components/liquidity-pool/liquidity-pools-table";
import { getLiquidityPoolsByCurrencyId } from "@/api/liquidity-pool/action";
import { getTranslations } from "next-intl/server";

export default async function page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  try {
    const t = await getTranslations("LiquidityPool");

    const currencyId = (await searchParams)?.currencyId;
    if (!currencyId)
      return (
        <div className="w-full h-full flex justify-center items-center">
          <span className="text-3xl capitalize">
            {t("selectCurrency")}
          </span>
        </div>
      );

    const { data: currency } = await getCurrencyById(currencyId);
    if (!currency) return <div>{t("currencyNotFound")}</div>;

    const { data } = await getLiquidityPoolsByCurrencyId(currencyId);

    return (
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <span className="text-3xl">{currency.name}</span>
          <AddLiquidityPoolDialog currency={currency} />
        </div>

        <LiquidityPoolsTable data={data || []} />
      </div>
    );
  } catch (error) {
    console.error("[LIQUIDITY_POOL_PAGE]", error);
    return <div>Internal server error</div>;
  }
}
