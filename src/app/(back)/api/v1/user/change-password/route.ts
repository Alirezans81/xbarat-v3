import { userService } from "@/lib/back/services/user.service";
import {
  BadRequestResponse,
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return MissingFieldsResponse;
    }

    const isCurrentPasswordCorrect = await userService.checkPassword(
      payload.id,
      currentPassword
    );
    if (!isCurrentPasswordCorrect) {
      return BadRequestResponse;
    }

    const isPasswordChanged = await userService.updatePassword(
      payload.id,
      newPassword
    );

    return NextResponse.json({ success: isPasswordChanged }, { status: 200 });
  } catch (error) {
    console.error("[CHANGE_PASSWORD]", error);
    return ServerErrorResponse;
  }
}
