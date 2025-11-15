import { currencyPairService } from "@/lib/back/services/currencyPair.service";
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
    const currencyPair = await currencyPairService.getById(id);
    if (!currencyPair)
      return NextResponse.json(
        { message: "currencyPairNotFound" },
        { status: 404 }
      );

    return NextResponse.json(currencyPair, { status: 200 });
  } catch (error) {
    console.error("[GET_CURRENCY_PAIR]", error);
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
    const {
      fromCurrencyId,
      toCurrencyId,
      rate,
      feePercentage,
      isInverseRate,
      isActive,
    } = await request.json();
    const newCurrency = await currencyPairService.updateById(id, {
      fromCurrencyId,
      toCurrencyId,
      rate,
      feePercentage,
      isInverseRate,
      isActive,
    });

    return NextResponse.json(newCurrency, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_CURRENCY_PAIR]", error);
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

    const deletedCurrency = await currencyPairService.deleteById(id);

    return NextResponse.json(deletedCurrency, { status: 200 });
  } catch (error) {
    console.error("[DELETE_CURRENCY_PAIR]", error);
    return ServerErrorResponse;
  }
}
