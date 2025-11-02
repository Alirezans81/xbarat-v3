import { getBridgeTransfersByLiquidityPoolId } from "@/api/bridge-transfer/action";
import { getLiquidityPoolById } from "@/api/liquidity-pool/action";
import PaymentsTable from "@/components/liquidity-pool/payments-table";
import { getTranslations } from "next-intl/server";

export default async function page({
  params,
}: {
  params: Promise<{ liquidityPoolId: string }>;
}) {
  const t = await getTranslations("LiquidityPool");

  const { liquidityPoolId: liquidityPoolId } = await params;
  const liquidityPool = await getLiquidityPoolById(liquidityPoolId);
  if (!liquidityPool) return <div>{t("liquidityPoolNotFound")}</div>;

  const data = await getBridgeTransfersByLiquidityPoolId(liquidityPoolId);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <span className="text-3xl">{t("payments")}</span>
      </div>

      <PaymentsTable data={data || []} />
    </div>
  );
}
