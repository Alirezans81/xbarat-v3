import { cn } from "@/lib/front/utils/tailwind";
import { CurrencyItem } from "./types";

type Props = {
  item: CurrencyItem;
  active?: boolean;
};

export function CurrencyCard({ item, active }: Props) {
  return (
    <div
      className={cn(
        "w-[260px] shrink-0 rounded-2xl p-4 transition-all duration-300",
        "bg-zinc-900/70 backdrop-blur",
        active
          ? "scale-100 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
          : "scale-90 opacity-40 blur-[1px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-zinc-300">
        <div className="flex items-center gap-2">
          <span>{item.from.flag}</span>
          <span>{item.from.code}</span>
          <span className="opacity-40">→</span>
          <span>{item.to.flag}</span>
          <span>{item.to.code}</span>
        </div>
        <span className="h-2 w-2 rounded-full bg-green-500" />
      </div>

      {/* Body */}
      <div className="mt-4 space-y-3">
        <Stat label="Latest Transaction" value={item.latest} />
        <Stat label="Low" value={item.low} trend="down" />
        <Stat label="High" value={item.high} trend="up" />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  trend,
}: {
  label: string;
  value: number;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-xl bg-zinc-800/70 px-3 py-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400">{label}</span>
        {trend && (
          <span
            className={cn(
              "text-sm -mt-1.5",
              trend === "up" ? "text-green-500" : "text-red-500"
            )}
          >
            {trend === "up" ? "↗" : "↘"}
          </span>
        )}
      </div>
      <div className="mt-1 text-base font-medium text-zinc-100">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
