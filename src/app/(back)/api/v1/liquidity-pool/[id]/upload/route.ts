import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { depositService } from "@/lib/back/services/wallet/deposit.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { bridgeTransferService } from "@/lib/back/services/bridgeTransfer.service";
import { withdrawalService } from "@/lib/back/services/wallet/withdrawal.service";

export const runtime = "nodejs";

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

    const userOwnsTheBridgeTransfer =
      await bridgeTransferService.userOwnsTheBridgeTransfer(payload.id, id);
    if (!userOwnsTheBridgeTransfer) return UnauthorizedResponse;

    const formData = await request.formData();
    const file = formData.get("document") as File;

    if (!file) {
      return NextResponse.json({ error: "noFileUploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = process.env.UPLOAD_DIR || "/uploads";
    fs.mkdirSync(uploadDir, { recursive: true });

    const sanitizedFileName = file.name
      .replace(/[^a-z0-9_.-]/gi, "_")
      .toLowerCase();
    const fileName = `${Date.now()}-${id}-${sanitizedFileName}`;

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const forwardedHost =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const forwardedProto =
      request.headers.get("x-forwarded-proto") ||
      (process.env.NEXT_PUBLIC_APP_MODE === "production" ? "https" : "http");

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${forwardedProto}://${forwardedHost}`;

    const fileUrl = `${baseUrl}/uploads/${fileName}`;

    const newBridgeTransfer = await bridgeTransferService.updateById(id, {
      documentUrl: fileUrl,
      status: "APPROVAL",
    });

    if (newBridgeTransfer.withdrawalId) {
      await withdrawalService.updateById(newBridgeTransfer.withdrawalId, {
        status: "APPROVAL",
      });
    }

    return NextResponse.json(newBridgeTransfer, { status: 200 });
  } catch (error) {
    console.error("[UPLOAD_LIQUIDITY_POOL_DOCUMENT]", error);
    return ServerErrorResponse;
  }
}
