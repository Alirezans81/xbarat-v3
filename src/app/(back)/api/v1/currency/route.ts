import { currencyService } from "@/lib/back/services/currency.service";
import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const currencies = await currencyService.getAll();
    return NextResponse.json(currencies, { status: 200 });
  } catch (error) {
    console.error("[GET_CURRENCIES]", error);
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
    const { code, name, symbol, decimals, paymentChannelIds } = body;

    if (!code || !name || !symbol || !paymentChannelIds)
      return MissingFieldsResponse;

    const currency = await currencyService.create({
      code,
      name,
      symbol,
      decimals: decimals ?? 0,
      paymentChannelIds,
    });

    return NextResponse.json(currency, { status: 201 });
  } catch (error) {
    console.error("[CREATE_CURRENCY]", error);
    return ServerErrorResponse;
  }
}
