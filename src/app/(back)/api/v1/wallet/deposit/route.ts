import { Deposit, DepositStatus } from "@/generated/prisma";
import { depositService } from "@/lib/back/services/wallet/deposit.service";
import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";
import { GetDepositsFilters } from "@/types/front/wallet/deposit";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const body = await request.json();
    const { amount, walletId, paymentChannelId } = body;

    if (!amount || !walletId || !paymentChannelId) return MissingFieldsResponse;

    const deposit = await depositService.create({
      userId: payload.id,
      amount,
      walletId,
      paymentChannelId,
    });

    return NextResponse.json(deposit, { status: 201 });
  } catch (error) {
    console.error("[CREATE_DEPOSIT]", error);
    return ServerErrorResponse;
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    let deposits: Deposit[] = [];

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);

    if (userIsAdmin) {
      const searchParams = request.nextUrl.searchParams;

      const filters: GetDepositsFilters = {
        userId: searchParams.get("userId") ?? undefined,
        paymentChannelId: searchParams.get("paymentChannelId") ?? undefined,
        currencyId: searchParams.get("currencyId") ?? undefined,
        status: (searchParams.get("status") as DepositStatus) ?? undefined,
      };

      deposits = await depositService.getAll(filters);
    } else {
      deposits = await depositService.getAll({ userId: payload.id });
    }

    return NextResponse.json(deposits, { status: 200 });
  } catch (error) {
    console.error("[GET_DEPOSITS]", error);
    return ServerErrorResponse;
  }
}
