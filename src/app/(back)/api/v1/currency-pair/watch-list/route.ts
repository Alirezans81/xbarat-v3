import { currencyPairService } from "@/lib/back/services/currencyPair.service";
import { exchangeService } from "@/lib/back/services/wallet/exchange.service";
import { exchangeMatchService } from "@/lib/back/services/wallet/exchangeMatch.service";
import { ServerErrorResponse } from "@/lib/back/utils/globalResponses.utils";
import { WatchList } from "@/types/back/currencyPair";
import { Exchange } from "@/types/back/wallet/exchange";
import { CurrencyPair } from "@/types/front/currencyPair";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currencyPairs = await currencyPairService.getAll();

    const watchListData: WatchList[] = [];

    for (const currencyPair of currencyPairs) {
      const reverseCurrencyPair =
        await currencyPairService.getOppositeByCurrencyPair(currencyPair);

      const lastSourceToTargetExchangeMatch =
        await exchangeMatchService.getLastByCurrencyPairId(currencyPair.id);

      let lowestExchangeRateExchange: Exchange | null = null;
      let highestExchangeRateExchange: Exchange | null = null;

      if (reverseCurrencyPair) {
        if (!currencyPair.isInverseRate) {
          lowestExchangeRateExchange =
            (
              await exchangeService.getLast({
                currencyPairId: currencyPair.id,
                status: ["PENDING", "PARTIAL"],
              })
            )?.[0] || null;

          highestExchangeRateExchange =
            (
              await exchangeService.getLast({
                currencyPairId: reverseCurrencyPair.id,
                status: ["PENDING", "PARTIAL"],
              })
            )?.[0] || null;
        } else {
          lowestExchangeRateExchange =
            (
              await exchangeService.getLast({
                currencyPairId: reverseCurrencyPair.id,
                status: ["PENDING", "PARTIAL"],
              })
            )?.[0] || null;

          highestExchangeRateExchange =
            (
              await exchangeService.getLast({
                currencyPairId: currencyPair.id,
                status: ["PENDING", "PARTIAL"],
              })
            )?.[0] || null;
        }
      }

      watchListData.push({
        currencyPair: currencyPair as unknown as CurrencyPair,
        latest: lastSourceToTargetExchangeMatch
          ? +lastSourceToTargetExchangeMatch.fromExchange.exchangeRate
          : 0,
        low: lowestExchangeRateExchange
          ? +lowestExchangeRateExchange.exchangeRate
          : 0,
        high: highestExchangeRateExchange
          ? +highestExchangeRateExchange.exchangeRate
          : 0,
      });
    }

    return NextResponse.json(watchListData, { status: 200 });
  } catch (error) {
    console.log("[GET_WATCH_LIST]", error);
    return ServerErrorResponse;
  }
}
