// app/api/deposit/route.ts
import { Deposit } from "@/generated/prisma";
import { depositService } from "@/lib/back/services/deposit.service";
import { userService } from "@/lib/back/services/user.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/global-responses";
import { jwtUtils } from "@/lib/back/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const body = await request.json();
    const { amount, walletId, paymentChannelId } = body;

    if (!amount || !walletId || !paymentChannelId)
      return NextResponse.json({ message: "missingFields" }, { status: 400 });

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
      const userId = searchParams.get("userId");

      if (userId) deposits = await depositService.getUserDeposits(userId);
      else deposits = await depositService.getAll();
    } else {
      deposits = await depositService.getUserDeposits(payload.id);
    }

    return NextResponse.json(deposits, { status: 200 });
  } catch (error) {
    console.error("[GET_DEPOSITS]", error);
    return ServerErrorResponse;
  }
}
