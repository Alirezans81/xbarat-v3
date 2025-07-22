import { Withdrawal, WithdrawalStatus } from "@/generated/prisma";
import { withdrawalService } from "@/lib/back/services/wallet/withdrawal.service";
import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";
import { GetWithdrawalsFilters } from "@/types/front/wallet/withdrawal";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const body = await request.json();
    const { amount, walletId, paymentChannelId } = body;

    if (!amount || !walletId || !paymentChannelId) return MissingFieldsResponse;

    const withdrawal = await withdrawalService.create({
      userId: payload.id,
      amount,
      walletId,
      paymentChannelId,
    });

    return NextResponse.json(withdrawal, { status: 201 });
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

    let withdrawals: Withdrawal[] = [];

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);

    if (userIsAdmin) {
      const searchParams = request.nextUrl.searchParams;

      const filters: GetWithdrawalsFilters = {
        userId: searchParams.get("userId") ?? undefined,
        paymentChannelId: searchParams.get("paymentChannelId") ?? undefined,
        currencyId: searchParams.get("currencyId") ?? undefined,
        status: (searchParams.get("status") as WithdrawalStatus) ?? undefined,
      };

      withdrawals = await withdrawalService.getAll(filters);
    } else {
      withdrawals = await withdrawalService.getAll({ userId: payload.id });
    }

    return NextResponse.json(withdrawals, { status: 200 });
  } catch (error) {
    console.error("[GET_WITHDRAWALS]", error);
    return ServerErrorResponse;
  }
}
