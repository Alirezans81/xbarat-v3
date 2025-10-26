import { getTranslations } from "next-intl/server";

export default async function loading() {
  const t = await getTranslations("LiquidityPool");

  return <div>{t("loading")}</div>;
}
