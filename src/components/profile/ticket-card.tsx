import { cn } from "@/lib/front/utils/tailwind"

type Props = {
    className?: string
}

export default function TicketCard({ className }: Props) {
    return (
        <section
            className={cn(className)}
        >
            TicketCard
        </section>
    )
}
