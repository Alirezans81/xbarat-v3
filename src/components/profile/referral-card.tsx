import { cn } from "@/lib/front/utils/tailwind";
import Glass from "@/components/ui/glass";
import { Card } from "@/components/ui/card";

type Props = {
  className?: string;
};

export default function ReferralCard({ className }: Props) {
  return (
    <section className={cn(className)}>
      <Glass className="rounded-lg w-full h-full">
        <Card className="w-full h-full flex flex-col p-5 justify-start items-start gap-4 text-muted-foreground/75">
          {/* Header */}
          <div className="w-full h-fit flex justify-between items-start">
            <span className="text-lg">Referral</span>
          </div>
          <span className="w-full h-full flex justify-center items-center contain-content text-5xl  text-foreground">
            Coming Soon!
          </span>
          {/* Footer hint */}
          <span className="w-full h-fit text-sm text-muted-foreground">
            Invite friends and earn rewards once referrals go live.
          </span>
        </Card>
      </Glass>
    </section>
  );
}
