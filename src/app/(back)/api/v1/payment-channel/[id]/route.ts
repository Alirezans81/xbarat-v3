import { paymentChannelService } from "@/lib/back/services/paymentChannel.service";
import { userService } from "@/lib/back/services/user.service";
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

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    if (!userIsAdmin) return UnauthorizedResponse;

    const { id } = await params;
    const body = await request.json();
    const { name, description } = body;

    const newPaymentChannel = await paymentChannelService.updateById(id, {
      name,
      description,
    });

    return NextResponse.json(newPaymentChannel, { status: 200 });
  } catch (error) {
    console.error("[UPADTE_PAYMENT_CHANNEL]", error);
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

    const deletedPaymentChannel = await paymentChannelService.deleteById(id);

    return NextResponse.json(deletedPaymentChannel, { status: 200 });
  } catch (error) {
    console.error("[DELETE_PAYMENT_CHANNEL]", error);
    return ServerErrorResponse;
  }
}
