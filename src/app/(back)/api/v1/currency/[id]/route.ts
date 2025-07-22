import { currencyService } from "@/lib/back/services/currency.service";
import { userService } from "@/lib/back/services/user.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currency = await currencyService.getById(id);
    if (!currency)
      return NextResponse.json(
        { message: "currencyNotFound" },
        { status: 404 }
      );

    return NextResponse.json(currency, { status: 200 });
  } catch (error) {
    console.error("[GET_CURRENCY]", error);
    return ServerErrorResponse;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    if (!userIsAdmin) return UnauthorizedResponse;

    const { id } = await params;
    const { name, code, symbol, decimals, paymentChannelIds } =
      await request.json();
    const newCurrency = await currencyService.updateById(id, {
      name,
      code,
      symbol,
      decimals,
      paymentChannelIds,
    });

    return NextResponse.json(newCurrency, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_CURRENCY]", error);
    return ServerErrorResponse;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    if (!userIsAdmin) return UnauthorizedResponse;

    const { id } = await params;

    const deletedCurrency = await currencyService.deleteById(id);

    return NextResponse.json(deletedCurrency, { status: 200 });
  } catch (error) {
    console.error("[DELETE_CURRENCY]", error);
    return ServerErrorResponse;
  }
}
