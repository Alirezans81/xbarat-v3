import { CurrencyPair } from "@/generated/prisma";
import { currencyPairService } from "@/lib/back/services/currencyPair.service";
import { exchangeService } from "@/lib/back/services/wallet/exchange.service";
import { exchangeMatchService } from "@/lib/back/services/wallet/exchangeMatch.service";
import { Exchange } from "@/types/back/wallet/exchange";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currencyPairs = await currencyPairService.getAll();

    const watchListData: {
      currencyPair: CurrencyPair;
      last: number;
      low: number;
      high: number;
    }[] = [];

    currencyPairs.map(async (currencyPair) => {
      const reverseCurrencyPair =
        await currencyPairService.getOppositeByCurrencyPair(currencyPair);

      if (!reverseCurrencyPair) return;

      const lastSourceToTargetExchangeMatch =
        await exchangeMatchService.getLastByCurrencyPairId(currencyPair.id);

      let lowestExchangeRateExchange: Exchange | null = null;
      let highestExchangeRateExchange: Exchange | null = null;

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

        watchListData.push({
          currencyPair,
          last: lastSourceToTargetExchangeMatch
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
    });

    return NextResponse.json(watchListData, { status: 200 });
  } catch (error) {
    console.log("[GET_WATCH_LIST]", error);
  }
}
