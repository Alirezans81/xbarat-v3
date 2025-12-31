import { cn } from "@/lib/front/utils/tailwind"

type Props = {
    className?: string
}

export default function PromoBanner({ className }: Props) {
    return (
        <section
            className={cn(className)}
        >
            PromoBanner
        </section>
    )
}
