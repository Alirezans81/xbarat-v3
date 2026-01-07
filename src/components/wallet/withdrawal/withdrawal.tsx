import React from 'react'
import { cn } from '@/lib/front/utils/tailwind'
type Props = {
    className: string;
}

const Withdrawal = ({ className }: Props) => {
    return (
        <section className={cn(className)}>
            Withdrawal
        </section>
    )
}

export default Withdrawal