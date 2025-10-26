import { currencyPairService } from "@/lib/back/services/currencyPair.service";
import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const currencyPairs = await currencyPairService.getAll();
    return NextResponse.json(currencyPairs, { status: 200 });
  } catch (error) {
    console.error("[GET_CURRENCY_PAIRS]", error);
    return ServerErrorResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    if (!userIsAdmin) return UnauthorizedResponse;

    const body = await request.json();
    const { fromCurrencyId, toCurrencyId, rate, isInverseRate, isActive } =
      body;

    if (!fromCurrencyId || !toCurrencyId || !rate || !isActive)
      return MissingFieldsResponse;

    const currencyPair = await currencyPairService.create({
      fromCurrencyId,
      toCurrencyId,
      rate,
      isInverseRate,
      isActive,
    });

    return NextResponse.json(currencyPair, { status: 201 });
  } catch (error) {
    console.error("[CREATE_CURRENCY_PAIR]", error);
    return ServerErrorResponse;
  }
}
