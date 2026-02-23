import { depositService } from "@/lib/back/services/wallet/deposit.service";
import {
  NotFoundResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;

    const userOwnsDeposit = await depositService.userOwnsTheDeposit(
      payload.id,
      id,
    );
    if (!userOwnsDeposit) return UnauthorizedResponse;

    const foundDeposit = await depositService.getById(id);
    if (!foundDeposit) return NotFoundResponse;

    return NextResponse.json(foundDeposit, { status: 200 });
  } catch (error) {
    console.error("[UPADTE_DEPOSIT]", error);
    return ServerErrorResponse;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;

    const userOwnsDeposit = await depositService.userOwnsTheDeposit(
      payload.id,
      id,
    );
    if (!userOwnsDeposit) return UnauthorizedResponse;

    const body = await request.json();
    const { amount, walletId, paymentChannelId } = body;

    const newDeposit = await depositService.updateById(id, {
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;

    const userOwnsDeposit = await depositService.userOwnsTheDeposit(
      payload.id,
      id,
    );
    if (!userOwnsDeposit) return UnauthorizedResponse;

    const deletedDeposit = await depositService.deleteById(id);

    return NextResponse.json(deletedDeposit, { status: 200 });
  } catch (error) {
    console.error("[DELETE_DEPOSIT]", error);
    return ServerErrorResponse;
  }
}
