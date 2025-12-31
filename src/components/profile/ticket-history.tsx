import { cn } from "@/lib/front/utils/tailwind";

type Props = {
    className?: string
}
export default function TicketHistory({ className }: Props) {
    return (
        <section
            className={cn(className)}
        >
            TicketHistory
        </section>
    )
}
