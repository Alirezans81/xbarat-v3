import React from 'react'
import { cn } from '@/lib/front/utils/tailwind'

type Props = {
    className: string;
}

const Report = ({ className }: Props) => {
    return (
        <section className={cn(className)}>Report</section>
    )
}

export default Report