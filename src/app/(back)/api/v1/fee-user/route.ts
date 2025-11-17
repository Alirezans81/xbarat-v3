import { feeUserService } from "@/lib/back/services/feeUser.service";
import { userService } from "@/lib/back/services/user.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
  MissingFieldsResponse,
  NotFoundResponse,
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
    if (!userIsAdmin) return UnauthorizedResponse;

    const feeUsers = await feeUserService.getAll();
    return NextResponse.json(feeUsers, { status: 200 });
  } catch (error) {
    console.error("[GET_FEE_USERS]", error);
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
    const { email } = body;
    if (!email) return MissingFieldsResponse;

    const foundUser = await userService.getUserByEmail(email);
    if (!foundUser) return NotFoundResponse;

    const newFeeUser = await feeUserService.create({
      userId: foundUser.id,
    });

    return NextResponse.json(newFeeUser, { status: 201 });
  } catch (error) {
    console.error("[CREATE_FEE_USER]", error);
    return ServerErrorResponse;
  }
}
