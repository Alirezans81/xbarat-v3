import { Exchange, ExchangeStatus } from "@/generated/prisma/wasm";
import { exchangeService } from "@/lib/back/services/wallet/exchange.service";
import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { GetExchangesFilters } from "@/types/back/wallet/exchange";
import { NextRequest, NextResponse } from "next/server";
import { currencyPairService } from "@/lib/back/services/currencyPair.service";
import { exchangeMatchService } from "@/lib/back/services/wallet/exchangeMatch.service";
import { walletService } from "@/lib/back/services/wallet.service";
import { calculateFee } from "@/lib/back/utils/exchange.utils";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const body = await request.json();
    const { currencyPairId, fromAmount, toAmount, exchangeRate } = body;

    if (!currencyPairId || !fromAmount || !toAmount || !exchangeRate)
      return MissingFieldsResponse;

    const selectedCurrencyPair =
      await currencyPairService.getById(currencyPairId);

    const fee = selectedCurrencyPair
      ? calculateFee(+fromAmount, +selectedCurrencyPair.feePercentage)
      : 0;

    const exchange = await exchangeService.create({
      userId: payload.id,
      currencyPairId,
      fromAmount,
      remainingAmount: fromAmount,
      toAmount,
      exchangeRate,
      fee,
    });

    // Check for exchange match
    const currencyPair = await currencyPairService.getById(currencyPairId);
    if (currencyPair) {
      const oppositeCurrencyPair =
        await currencyPairService.getOppositeByCurrencyPair(currencyPair);

      if (oppositeCurrencyPair) {
        const exchanges = await exchangeService.getAll({
          currencyPairId: oppositeCurrencyPair.id,
          status: ["PENDING", "PARTIAL"],
        });

        const sortedExchanges = oppositeCurrencyPair.isInverseRate
          ? exchanges.sort((a, b) => +b.exchangeRate - +a.exchangeRate)
          : exchanges.sort((a, b) => +a.exchangeRate - +b.exchangeRate);
        const foundMatch = sortedExchanges[0]
          ? currencyPair.isInverseRate
            ? +sortedExchanges[0].exchangeRate <= +exchangeRate
              ? sortedExchanges[0]
              : null
            : +sortedExchanges[0].exchangeRate >= +exchangeRate
              ? sortedExchanges[0]
              : null
          : null;
        if (foundMatch) {
          const toRemainingAmount = foundMatch.currencyPair.isInverseRate
            ? +foundMatch.remainingAmount / +foundMatch.exchangeRate
            : +foundMatch.remainingAmount * +foundMatch.exchangeRate;

          const fromMatchedAmount = Math.min(
            fromAmount,
            toRemainingAmount,
          );
          const toMatchedAmount = exchange.currencyPair.isInverseRate
            ? +fromMatchedAmount / +exchangeRate
            : +fromMatchedAmount * +exchangeRate;

          await exchangeMatchService.create({
            fromExchangeId: exchange.id,
            toExchangeId: foundMatch.id,
            fromMatchedAmount,
            toMatchedAmount,
          });

          let exchangeStatus: ExchangeStatus = "PARTIAL";
          if (+exchange.remainingAmount - +fromMatchedAmount === 0)
            exchangeStatus = "COMPLETED";
          await exchangeService.updateById(exchange.id, {
            status: exchangeStatus,
            remainingAmount: +exchange.remainingAmount - +fromMatchedAmount,
            matchedAmount: +exchange.matchedAmount + +fromMatchedAmount,
          });
          await walletService.updateByUserIdAndCurrencyId(
            exchange.userId,
            exchange.currencyPair.toCurrency.id,
            {},
          );

          let foundMatchStatus: ExchangeStatus = "PARTIAL";
          if (+foundMatch.remainingAmount - +toMatchedAmount === 0)
            foundMatchStatus = "COMPLETED";
          await exchangeService.updateById(foundMatch.id, {
            status: foundMatchStatus,
            remainingAmount: +foundMatch.remainingAmount - +toMatchedAmount,
            matchedAmount: +foundMatch.matchedAmount + +toMatchedAmount,
          });
        }
      }
    }

    return NextResponse.json(exchange, { status: 201 });
  } catch (error) {
    console.error("[CREATE_EXCHANGE]", error);
    return ServerErrorResponse;
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    let exchanges: Exchange[] = [];

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);

    if (userIsAdmin) {
      const searchParams = request.nextUrl.searchParams;

      const userId = searchParams.get("userId") ?? undefined;
      const currencyPairId = searchParams.get("currencyPairId") ?? undefined;
      const status =
        (searchParams.get("status") as unknown as ExchangeStatus[]) ??
        undefined;
      const ltAmount = searchParams.get("ltAmount") ?? undefined;
      const gtAmount = searchParams.get("gtAmount") ?? undefined;
      const ltExchangeRate = searchParams.get("ltExchangeRate") ?? undefined;
      const gtExchangeRate = searchParams.get("gtExchangeRate") ?? undefined;

      const filters: GetExchangesFilters = {
        userId,
        currencyPairId,
        status,
        ltAmount: ltAmount ? +ltAmount : undefined,
        gtAmount: gtAmount ? +gtAmount : undefined,
        ltExchangeRate: ltExchangeRate ? +ltExchangeRate : undefined,
        gtExchangeRate: gtExchangeRate ? +gtExchangeRate : undefined,
      };

      exchanges = await exchangeService.getAll(filters);
    } else {
      exchanges = await exchangeService.getAll({ userId: payload.id });
    }

    return NextResponse.json(exchanges, { status: 200 });
  } catch (error) {
    console.error("[GET_EXCHANGES]", error);
    return ServerErrorResponse;
  }
}
