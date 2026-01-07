import { cn } from "@/lib/front/utils/tailwind";
import Glass from "@/components/ui/glass";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
};

export default function ReferralCard({ className }: Props) {
  const t = useTranslations("Profile");

  return (
    <section className={cn(className)}>
      <Glass className="rounded-lg w-full h-full">
        <Card className="w-full h-full flex flex-col p-5 justify-start items-start gap-4 text-muted-foreground/75">
          {/* Header */}
          <div className="w-full h-fit flex justify-between items-start">
            <span className="text-lg">{t("referral")}</span>
          </div>
          <span className="w-full h-full flex justify-center items-center contain-content text-5xl  text-foreground">
            {t("coming-soon")}
          </span>
          {/* Footer hint */}
          <span className="w-full h-fit text-sm text-muted-foreground">
            {t("invite-friends-text")}
          </span>
        </Card>
      </Glass>
    </section>
  );
}
