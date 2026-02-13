"use client";

import {
  CurrencyPair,
  WatchList as WatchListType,
} from "@/types/front/currencyPair";
import { CurrencyCarousel } from "./Watchlist/currency-carousel";
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
  }, [getWatchList]);

  return (
    <div className="px-10">
      {loading ? (
        <div className="h-88 flex justify-center items-center">
          <Spinner className="w-10 h-10 text-primary mx-auto" />
        </div>
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
