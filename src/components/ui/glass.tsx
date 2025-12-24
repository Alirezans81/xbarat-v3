import { ReactNode } from 'react'
import { cn } from '@/lib/front/utils/tailwind'

type GlassProps = {
    children: ReactNode
    className?: string
}

export default function Glass({ children, className }: GlassProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl',
                className
            )}
        >
            {/* Glass layer */}
            <div
                className="
                    absolute inset-0 z-0
                    bg-[linear-gradient(-45deg,
                        rgba(255,255,255,0.18),
                        rgba(255,255,255,0.05)
                    )]
                    backdrop-blur-[16px]
                    shadow-[0_20px_60px_rgba(0,0,0,0.4)]
                    border border-white/10
        "
            />

            {/* Dispersion highlight */}
            <div
                className="
          pointer-events-none
          absolute inset-0 z-0
          bg-[radial-gradient(circle_at_30%_20%,
            rgba(255,0,128,0.15),
            transparent_40%
          )]
          opacity-50
        "
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
