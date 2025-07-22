"use client";

import { useGetCurrencies } from "@/api/currency/hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentTime } from "@/hooks/use-time";
import { Link } from "@/i18n/navigation";
import { Currency } from "@/types/front/currency";
import { ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const currentTime = useCurrentTime();

  const [sources, setSources] = useState<Currency[]>([]);
  const [targets, setTargets] = useState<Currency[]>([]);

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState("");

  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");

  const [loading, setLoading] = useState(true);

  const getCurrencies = useGetCurrencies();

  useEffect(() => {
    getCurrencies({
      setCurrencies: setSources,
      onFinally() {
        setLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    setTargets(sources.filter((e) => e.id !== selectedSourceId));
  }, [sources, selectedSourceId]);

  const [isSwitching, setIsSwitching] = useState(false);
  const switchCurrencies = () => {
    setIsSwitching(true);
    const temp = selectedSourceId;
    setSelectedSourceId(selectedTargetId);
    setSelectedTargetId(temp);
  };
  useEffect(() => {
    if (isSwitching) setIsSwitching(false);
  }, [isSwitching, selectedTargetId]);

  const handleSubmit = () => {
    console.log(1);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col justify-center items-center gap-8 py-36 container mx-auto px-5">
        <span className="capitalize text-6xl font-bold">
          when you are enough!
        </span>
        <Skeleton
          className={`lg:h-47.5 lg:w-210 rounded-xl ${
            loading ? "block" : "hidden"
          }`}
        />
        <form
          className={`bg-accent px-6 py-5 rounded-xl flex flex-col items-center gap-4 ${
            loading ? "hidden" : "block"
          }`}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="w-full flex gap-4">
            <div className="flex-1 flex">
              <Select
                value={selectedSourceId}
                onValueChange={(value) => {
                  setSelectedSourceId(value);
                  if (!isSwitching) {
                    setSelectedTargetId("");
                    setAmount("");
                    setRate("");
                  }
                }}
                required
              >
                <SelectTrigger className="w-[7rem] rounded-r-none lg:text-lg lg:py-5">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="flex-1 rounded-l-none lg:!text-lg lg:py-5"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="Amount"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    (
                      +e.currentTarget.value.replaceAll(",", "") || ""
                    ).toLocaleString()
                  )
                }
                required
              />
            </div>
            <button
              className="cursor-pointer"
              type="button"
              onClick={switchCurrencies}
            >
              <ArrowRightLeft />
            </button>
            <div className="flex-1 flex">
              <Select
                value={selectedTargetId}
                onValueChange={(value) => {
                  if (!isSwitching) {
                    setSelectedTargetId(value);
                    setAmount("1");
                    setRate((890000).toLocaleString());
                  }
                }}
                required
              >
                <SelectTrigger className="w-[7rem] rounded-r-none lg:text-lg lg:py-5">
                  <SelectValue placeholder="Target" />
                </SelectTrigger>
                <SelectContent>
                  {targets.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="flex-1 rounded-l-none lg:!text-lg lg:py-5"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="Rate"
                value={rate}
                onChange={(e) =>
                  setRate(
                    (
                      +e.currentTarget.value.replaceAll(",", "") || ""
                    ).toLocaleString()
                  )
                }
                required
              />
            </div>
          </div>
          <div className="w-full flex justify-between items-end">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span>
                  {sources.find((e) => e.id === selectedSourceId)?.symbol}{" "}
                  {amount || "0"}
                </span>
                <span>=</span>
                <span>
                  {targets.find((e) => e.id === selectedTargetId)?.symbol}{" "}
                  <span className="text-secondary">
                    {(
                      +amount.replaceAll(",", "") * +rate.replaceAll(",", "")
                    ).toLocaleString()}
                  </span>
                </span>
              </div>
              {selectedSourceId && selectedTargetId ? (
                <div className="text-muted-foreground">
                  Mid-market exchange rate at{" "}
                  <span className="text-foreground">
                    {currentTime.toLocaleTimeString()}
                  </span>{" "}
                  is{" "}
                  <button
                    className="text-secondary cursor-pointer"
                    type="button"
                    onClick={() => setRate((890000).toLocaleString())}
                  >
                    890,000.
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-muted-foreground">
                    Select <span className="text-foreground">source</span> and{" "}
                    <span className="text-foreground">target</span> currencies
                    to see the{" "}
                    <span className="text-secondary">mid-market rate.</span>
                  </span>
                </div>
              )}
            </div>
            <Button
              size={"lg"}
              type="submit"
              disabled={loading}
              className="text-lg"
            >
              {loading ? "Loading..." : "Exchange"}
            </Button>
          </div>
          <Link
            href="#tables"
            className="text-muted-foreground -mb-2 mt-2 transition-all duration-300 hover:text-foreground cursor-pointer w-fit"
          >
            See the tables.
          </Link>
        </form>
      </div>
    </div>
  );
}
