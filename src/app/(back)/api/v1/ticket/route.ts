import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { ticketService } from "@/lib/back/services/ticket.service";
import { userService } from "@/lib/back/services/user.service";
import { TicketStatus } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    const userIsSupport = await userService.checkUserIsSupport(payload.id);

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || undefined;
    const status = (searchParams.get("status") as TicketStatus) || undefined;

    if (userIsAdmin || userIsSupport) {
      const tickets = await ticketService.getAll({
        userId,
        status,
      });

      return NextResponse.json(tickets, { status: 200 });
    }

    const tickets = await ticketService.getAll({
      userId: payload.id,
    });

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("[GET_TICKETS]", error);
    return ServerErrorResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const body = await request.json();
    const { subject } = body;

    if (!subject) return MissingFieldsResponse;

    const ticket = await ticketService.create({
      userId: payload.id,
      subject,
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("[CREATE_TICKET]", error);
    return ServerErrorResponse;
  }
}
