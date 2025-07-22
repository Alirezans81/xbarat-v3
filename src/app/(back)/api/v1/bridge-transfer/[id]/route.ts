import { bridgeTransferService } from "@/lib/back/services/bridgeTransfer.service";
import { userService } from "@/lib/back/services/user.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;
    const bridgeTransfer = await bridgeTransferService.getById(id);
    if (!bridgeTransfer)
      return NextResponse.json(
        { message: "bridgeTransferNotFound" },
        { status: 404 }
      );

    return NextResponse.json(bridgeTransfer, { status: 200 });
  } catch (error) {
    console.error("[GET_BRIDGE_TRANSFER]", error);
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
    const body = await request.json();
    const {
      amount,
      depositId,
      liquidityPoolId,
      status,
      withdrawalId,
      paymentChannelId,
    } = body;

    const newBridgeTransfer = await bridgeTransferService.updateById(id, {
      amount,
      depositId,
      liquidityPoolId,
      status,
      withdrawalId,
      paymentChannelId,
    });

    return NextResponse.json(newBridgeTransfer, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_BRIDGE_TRANSFER]", error);
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

    const { id } = await params;

    if (userIsAdmin) {
      const deletedBridgeTransfer = await bridgeTransferService.deleteById(id);
      return NextResponse.json(deletedBridgeTransfer, { status: 200 });
    }

    return UnauthorizedResponse;
  } catch (error) {
    console.error("[DELETE_BRIDGE_TRANSFER]", error);
    return ServerErrorResponse;
  }
}
