import { cn } from "@/lib/front/utils/tailwind"

type Props = {
    className?: string
}

export default function CardsCard({ className }: Props) {
    return (
        <section
            className={cn(className)}
        >
            CardsCard
        </section>
    )
}
