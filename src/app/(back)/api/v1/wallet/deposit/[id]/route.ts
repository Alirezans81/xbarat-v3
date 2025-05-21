import { depositService } from "@/lib/back/services/deposit.service";
import { paymentChannelService } from "@/lib/back/services/paymentChannel.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/global-responses";
import { jwtUtils } from "@/lib/back/utils/jwt";
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

    const userOwnsDeposit = await depositService.userOwnsDeposit(
      payload.id,
      id
    );
    if (!userOwnsDeposit) return UnauthorizedResponse;

    const body = await request.json();
    const { amount, walletId, paymentChannelId } = body;

    const newDeposit = await depositService.updateById(id, {
      userId: payload.id,
      amount,
      walletId,
      paymentChannelId,
    });

    return NextResponse.json(newDeposit, { status: 200 });
  } catch (error) {
    console.error("[UPADTE_DEPOSIT]", error);
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

    const userOwnsDeposit = await depositService.userOwnsDeposit(
      payload.id,
      id
    );
    if (!userOwnsDeposit) return UnauthorizedResponse;

    const deletedDeposit = await depositService.deleteById(id);

    return NextResponse.json(deletedDeposit, { status: 200 });
  } catch (error) {
    console.error("[DELETE_DEPOSIT]", error);
    return ServerErrorResponse;
  }
}
