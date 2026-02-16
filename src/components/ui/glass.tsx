import { ReactNode } from "react";
import { cn } from "@/lib/front/utils/tailwind";

type GlassProps = {
  children: ReactNode;
  className?: string;
};

export default function Glass({ children, className }: GlassProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Base frosted layer */}
      <div
        className="
          absolute inset-0 z-0
          border border-white/12
          bg-[linear-gradient(165deg,rgba(0,0,0,0.14)_0%,rgba(10,10,10,0.08)_48%,rgba(60,60,60,0.14)_100%)]
          backdrop-blur-sm
          shadow-[0_14px_36px_rgba(0,0,0,0.28)]
        "
      />

      {/* Inner soft capsule glow inspired by the SVG center pill */}
      <div
        className="
          pointer-events-none
          absolute inset-0 z-0
          bg-[radial-gradient(58%_82%_at_50%_36%,rgba(50,50,50,0.36)_0%,rgba(30,30,30,0.22)_38%,rgba(10,10,10,0.08)_68%,transparent_100%)]
        "
      />

      {/* Top sheen + subtle edge contrast for glass depth */}
      <div
        className="
          pointer-events-none
          absolute inset-0 z-0
          bg-[linear-gradient(180deg,rgba(155,155,155,0.2)_0%,rgba(100,100,100,0.08)_16%,transparent_48%,rgba(35,35,35,0.18)_100%)]
        "
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
