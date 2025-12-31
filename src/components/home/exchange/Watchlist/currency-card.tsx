import { Button } from "@/components/ui/button";
import { cn } from "@/lib/front/utils/tailwind";
import { CurrencyPair, WatchList } from "@/types/front/currencyPair";

type Props = {
  item: WatchList | null;
  active?: boolean;
  selectedPair: CurrencyPair | null;
  setSelectedPair: (pair: CurrencyPair | null) => void;
};

export function CurrencyCard({
  item,
  active,
  selectedPair,
  setSelectedPair,
}: Props) {
  if (item) {
    return (
      <div
        className={cn(
          "w-full shrink-0 rounded-2xl p-4 transition-all duration-300",
          "bg-card backdrop-blur",
          active
            ? "scale-100 shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_40px_rgba(252,184,25,0.2)]"
            : "scale-90 opacity-50 blur-[1px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {selectedPair?.id === item.currencyPair.id ? (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full text-xs me-0.5 !bg-accent !text-foreground hover:cursor-default"
              >
                Selected
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full text-xs me-0.5 !bg-muted-foreground/0 !border-muted"
                disabled={!active}
                onClick={() => setSelectedPair(item.currencyPair)}
              >
                Select
              </Button>
            )}
            <span>{item.currencyPair.fromCurrency.code}</span>
            <span className="opacity-40">→</span>
            <span>{item.currencyPair.toCurrency.code}</span>
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
  } else {
    return (
      <div
        className={cn(
          "w-[260px] shrink-0 rounded-2xl p-4 transition-all duration-300"
        )}
      />
    );
  }
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
    <div className="rounded-xl bg-sidebar-accent px-3 py-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
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
      <div className="mt-1 text-base font-medium text-foreground">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
