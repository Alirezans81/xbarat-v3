import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";
import { Spinner } from "@/components/ui/spinner";

export default async function Loading() {
  const t = await getTranslations("HomePage");
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col justify-center items-center gap-8 py-36 container mx-auto px-5">
        <span className="capitalize text-6xl font-bold">
          {t("slogan")}
        </span>
        <Skeleton
          className={`w-full h-43 md:h-49 lg:h-43 lg:w-210 rounded-xl`}
        />
        <div className="h-88 flex justify-center items-center">
          <Spinner className="w-10 h-10 text-primary mx-auto" />
        </div>
      </div>
    </div>
  );
}
