import React from 'react'
import { cn } from '@/lib/front/utils/tailwind'

type Props = {
    className: string;
}
const Balance = ({ className }: Props) => {
    return (
        <section className={cn(className)}>Balance</section>
    )
}

export default Balance