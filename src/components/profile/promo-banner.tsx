import { cn } from "@/lib/front/utils/tailwind";
import Glass from "../ui/glass";
import { Card } from "../ui/card";
import { useTranslations } from "next-intl";
type Props = {
  className?: string;
};

export default function PromoBanner({ className }: Props) {
  const t = useTranslations("Profile");
  return (
    <section className={cn(className)}>
      <Glass className="rounded-lg w-full h-full max-h-72">
        <Card className="w-full h-full flex flex-col p-5 justify-start items-start gap-4">
          {/* Header */}
          <div className="w-full h-fit flex justify-between items-start text-muted-foreground/75">
            <span className="text-lg">{t("promo-banner")}</span>
          </div>
          <span className="w-full h-full flex justify-center items-center text-2xl text-foreground">
            {t("no-campaign-now")}
          </span>
          {/* Footer hint */}
          <span className="w-full h-fit text-sm text-muted-foreground">
            {t("campaign-notify")}😍
          </span>
        </Card>
      </Glass>
    </section>
  );
}
