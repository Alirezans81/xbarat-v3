import { userService } from "@/lib/back/services/user.service";
import {
  NotFoundResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const requesterIsAdmin = await userService.checkUserIsAdmin(payload.id);
    if (!requesterIsAdmin) return UnauthorizedResponse;

    const user = await userService.getById(params.id);
    if (!user) return NotFoundResponse;

    return NextResponse.json(user);
  } catch (error) {
    console.error("[GET_USER]", error);
    return ServerErrorResponse;
  }
}
