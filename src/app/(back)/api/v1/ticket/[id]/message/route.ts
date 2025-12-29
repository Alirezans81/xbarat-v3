import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { ticketService } from "@/lib/back/services/ticket.service";
import { ticketMessageService } from "@/lib/back/services/ticket/ticketMessage.service";
import { userService } from "@/lib/back/services/user.service";
import { r2 } from "@/lib/back/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

/* ===================== GET ===================== */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;
    const ticket = await ticketService.getById(id);
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
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;
    const ticket = await ticketService.getById(id);
    if (!ticket) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    const userIsSupport = await userService.checkUserIsSupport(payload.id);

    // یوزر عادی فقط روی تیکت خودش
    if (!userIsAdmin && !userIsSupport && ticket.userId !== payload.id) {
      return UnauthorizedResponse;
    }

    const formData = await request.formData();

    const message = formData.get("message")?.toString();
    if (!message) return MissingFieldsResponse;

    const filesUrl: string[] = [];
    const files = formData.getAll("files") as File[];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `tickets-${id}-${Date.now()}_${file.name}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
      filesUrl.push(fileUrl);
    }

    const ticketMessage = await ticketMessageService.create({
      ticketId: id,
      message,
      filesUrl,
      senderRole: userIsAdmin
        ? "ADMIN"
        : userIsSupport
        ? "SUPPORT"
        : "CUSTOMER",
    });

    return NextResponse.json(ticketMessage, { status: 201 });
  } catch (error) {
    console.error("[CREATE_TICKET_MESSAGE]", error);
    return ServerErrorResponse;
  }
}
