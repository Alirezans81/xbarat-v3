"use client";

import { useEffect, useState } from "react";
import { CurrencyCard } from "./currency-card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CurrencyPair, WatchList } from "@/types/front/currencyPair";
interface Props {
  items: WatchList[];
  selectedPair: CurrencyPair | null;
  setSelectedPair: (pair: CurrencyPair | null) => void;
}
export function CurrencyCarousel({
  items,
  selectedPair,
  setSelectedPair,
}: Props) {
  const [active, setActive] = useState(
    selectedPair
      ? items.findIndex((item) => item.currencyPair === selectedPair)
      : 0,
  );

  const [api, setApi] = useState<CarouselApi>();
  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      const selected = api.selectedScrollSnap();
      setActive(selected);
    });
  }, [api]);

  return (
    <Carousel
      opts={{
        align: "center",
      }}
      setApi={setApi}
      className=""
    >
      <div className="">
        <CarouselContent className="p-7">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5"
            >
              <div
                className={index === items.length - 1 ? "pe-4" : ""}
                onClick={() => setActive(index)}
              >
                <CurrencyCard
                  item={item}
                  active={index === active}
                  selectedPair={selectedPair}
                  setSelectedPair={setSelectedPair}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>

      <CarouselPrevious
        disabled={active > 0 ? false : true}
        onClick={() => {
          if (active > 0) {
            setActive(active - 1);
            api?.scrollTo(active - 1);
          }
        }}
      />
      <CarouselNext
        disabled={active < items.length - 1 ? false : true}
        onClick={() => {
          if (active < items.length - 1) {
            setActive(active + 1);
            api?.scrollTo(active + 1);
          }
        }}
      />
    </Carousel>
  );
}
