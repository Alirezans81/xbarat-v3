"use client";

import {
  CurrencyPair,
  WatchList as WatchListType,
} from "@/types/front/currencyPair";
import { CurrencyCarousel } from "./watchlist/currency-carousel";
import { useEffect, useState } from "react";
import { useGetWatchList } from "@/api/currency-pair/hook";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  setSelectedPair: (pair: CurrencyPair | null) => void;
  selectedPair: CurrencyPair | null;
}
export default function WatchList({ selectedPair, setSelectedPair }: Props) {
  const [watchList, setWatchList] = useState<WatchListType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getWatchList = useGetWatchList();
  useEffect(() => {
    getWatchList({
      setWatchList,
      onFinally() {
        setLoading(false);
      },
    });
  }, []);

  return (
    <div className="max-w-[87dvw]">
      {loading ? (
        <Spinner className="w-10 h-10 text-primary mx-auto" />
      ) : (
        <CurrencyCarousel
          items={watchList}
          selectedPair={selectedPair}
          setSelectedPair={setSelectedPair}
        />
      )}
    </div>
  );
}
