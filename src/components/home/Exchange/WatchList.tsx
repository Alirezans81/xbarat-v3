import { CurrencyPair } from "@/types/front/currencyPair";
import { CurrencyCarousel } from "./Watchlist/currency-carousel";

interface Props {
  setSelectedPair: (pair: CurrencyPair | null) => void;
  selectedPair: CurrencyPair | null;
}
export default function WatchList({ selectedPair, setSelectedPair }: Props) {
  const data = [
    {
      from: { code: "EUR", flag: "🇪🇺" },
      to: { code: "IRR", flag: "🟢" },
      latest: 121345000,
      low: 121000000,
      high: 122000000,
    },
    {
      from: { code: "CAD", flag: "🇨🇦" },
      to: { code: "IRR", flag: "🟢" },
      latest: 121345000,
      low: 121000000,
      high: 122000000,
    },
    {
      from: { code: "CAD", flag: "🇨🇦" },
      to: { code: "IRR", flag: "🟢" },
      latest: 121345000,
      low: 121000000,
      high: 122000000,
    },
    {
      from: { code: "CAD", flag: "🇨🇦" },
      to: { code: "IRR", flag: "🟢" },
      latest: 121345000,
      low: 121000000,
      high: 122000000,
    },
    {
      from: { code: "CAD", flag: "🇨🇦" },
      to: { code: "IRR", flag: "🟢" },
      latest: 121345000,
      low: 121000000,
      high: 122000000,
    },
    {
      from: { code: "CAD", flag: "🇨🇦" },
      to: { code: "IRR", flag: "🟢" },
      latest: 121345000,
      low: 121000000,
      high: 122000000,
    },
  ];

  return (
    <div className="w-[90dvw] py-10">
      <CurrencyCarousel items={data} />
    </div>
  );
}
