import { paymentChannelService } from "@/lib/back/services/paymentChannel.service";
import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    const userIsProvider = await userService.checkUserIsProvider(payload.id);
    if (!userIsAdmin && !userIsProvider) return UnauthorizedResponse;

    const searchParams = request.nextUrl.searchParams;
    const currencyId = searchParams.get("currencyId");

    if (currencyId) {
      const paymentChannel = await paymentChannelService.getAll({ currencyId });
      return NextResponse.json(paymentChannel, { status: 200 });
    }

    const paymentChannel = await paymentChannelService.getAll();
    return NextResponse.json(paymentChannel, { status: 200 });
  } catch (error) {
    console.error("[CREATE_PAYMENT_CHANNEL]", error);
    return ServerErrorResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    if (!userIsAdmin) return UnauthorizedResponse;

    const body = await request.json();
    const { name, description } = body;
    if (!name) return MissingFieldsResponse;

    const paymentChannel = await paymentChannelService.create({
      name,
      description,
    });

    return NextResponse.json(paymentChannel, { status: 201 });
  } catch (error) {
    console.error("[CREATE_PAYMENT_CHANNEL]", error);
    return ServerErrorResponse;
  }
}
