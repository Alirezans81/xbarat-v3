import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { ticketService } from "@/lib/back/services/ticket.service";
import { ticketMessageService } from "@/lib/back/services/ticketMessage.service";
import { userService } from "@/lib/back/services/user.service";

type Params = {
  params: {
    id: string;
  };
};

/* ===================== GET ===================== */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const ticket = await ticketService.getById(params.id);
    if (!ticket) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    const userIsSupport = await userService.checkUserIsSupport(payload.id);

    // یوزر عادی فقط تیکت خودش
    if (!userIsAdmin && !userIsSupport && ticket.userId !== payload.id) {
      return UnauthorizedResponse;
    }

    return NextResponse.json(ticket.messages ?? [], { status: 200 });
  } catch (error) {
    console.error("[GET_TICKET_MESSAGES]", error);
    return ServerErrorResponse;
  }
}

/* ===================== POST ===================== */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const ticket = await ticketService.getById(params.id);
    if (!ticket) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    const userIsSupport = await userService.checkUserIsSupport(payload.id);

    // یوزر عادی فقط روی تیکت خودش
    if (!userIsAdmin && !userIsSupport && ticket.userId !== payload.id) {
      return UnauthorizedResponse;
    }

    const body = await request.json();
    const { message, filesUrl } = body;

    if (!message) return MissingFieldsResponse;

    const ticketMessage = await ticketMessageService.create({
      ticketId: params.id,
      message,
      filesUrl,
    });

    return NextResponse.json(ticketMessage, { status: 201 });
  } catch (error) {
    console.error("[CREATE_TICKET_MESSAGE]", error);
    return ServerErrorResponse;
  }
}
