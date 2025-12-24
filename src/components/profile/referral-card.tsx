import { cn } from "@/lib/front/utils/tailwind"

type Props = {
    className?: string
}

export default function ReferralCard({ className }: Props) {
    return (
        <section
            className={cn(className)}
        >
            ReferralCard
        </section>
    )
}
