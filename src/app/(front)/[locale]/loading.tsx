import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("HomePage");
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col justify-center items-center gap-8 py-36 container mx-auto px-5">
        <span className="capitalize text-6xl font-bold">
          {t("slogan")}
        </span>
        <Skeleton className={`lg:h-47.5 lg:w-210 rounded-xl`} />
      </div>
    </div>
  );
}
