import { userService } from "@/lib/back/services/user.service";
import {
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

    const user = await userService.getById(payload.id);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("[GET_USER", error);
    return ServerErrorResponse;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const body = await request.json();
    const { fullName, phoneNumber, countryCode } = body;

    const newUser = await userService.updateUser(payload.id, {
      fullName,
      phoneNumber,
      countryCode,
    });

    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_USER]", error);
    return ServerErrorResponse;
  }
}
