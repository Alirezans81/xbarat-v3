import { feeUserService } from "@/lib/back/services/feeUser.service";
import { userService } from "@/lib/back/services/user.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
  MissingFieldsResponse,
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

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    if (userIsAdmin) {
      const { id } = await params;

      const feeUsers = await feeUserService.active(id);

      return NextResponse.json(feeUsers, { status: 200 });
    } else {
      return UnauthorizedResponse;
    }
  } catch (error) {
    console.error("[POST_FEE_USER]", error);
    return ServerErrorResponse;
  }
}
