import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { ticketService } from "@/lib/back/services/ticket.service";
import { UnauthorizedResponse } from "@/lib/back/utils/globalResponses.utils";
import { userService } from "@/lib/back/services/user.service";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) return UnauthorizedResponse;

  const payload = jwtUtils.verify(token);
  if (!payload) return UnauthorizedResponse;

  const isAdmin = await userService.checkUserIsAdmin(payload.id);
  const isSupport = await userService.checkUserIsSupport(payload.id);

  if (!isAdmin && !isSupport) return UnauthorizedResponse;

  const { id } = await params;
  const { status } = await request.json();

  if (status === "CLOSED") await ticketService.close(id);
  if (status === "OPEN") await ticketService.reopen(id);

  return NextResponse.json({ success: true });
}
