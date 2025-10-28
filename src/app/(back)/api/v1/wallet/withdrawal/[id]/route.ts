import { withdrawalService } from "@/lib/back/services/wallet/withdrawal.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;

    const userOwnsWithdrawal = await withdrawalService.userOwnsTheWithdrawal(
      payload.id,
      id
    );
    if (!userOwnsWithdrawal) return UnauthorizedResponse;

    const body = await request.json();
    const { amount, walletId, paymentChannelId } = body;

    const newWithdrawal = await withdrawalService.updateById(id, {
      amount,
      walletId,
      paymentChannelId,
    });

    return NextResponse.json(newWithdrawal, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_WITHDRAWAL]", error);
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

    const { id } = await params;

    const userOwnsWithdrawal = await withdrawalService.userOwnsTheWithdrawal(
      payload.id,
      id
    );
    if (!userOwnsWithdrawal) return UnauthorizedResponse;

    const deletedWithdrawal = await withdrawalService.deleteById(id);

    return NextResponse.json(deletedWithdrawal, { status: 200 });
  } catch (error) {
    console.error("[DELETE_WITHDRAWAL]", error);
    return ServerErrorResponse;
  }
}
