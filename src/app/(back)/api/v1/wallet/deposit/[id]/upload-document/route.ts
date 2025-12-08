import { NextRequest, NextResponse } from "next/server";
import { depositService } from "@/lib/back/services/wallet/deposit.service";
import {
  BadRequestResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { bridgeTransferService } from "@/lib/back/services/bridgeTransfer.service";
import { withdrawalService } from "@/lib/back/services/wallet/withdrawal.service";
import fs from "fs";
import path from "path";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // auth
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;

    const userOwnsDeposit = await depositService.userOwnsTheDeposit(
      payload.id,
      id
    );
    if (!userOwnsDeposit) return UnauthorizedResponse;

    // file
    const formData = await request.formData();

    const items: { bridgeTransferId: string; document: File }[] = [];

    for (const key of formData.keys()) {
      const match = key.match(
        /^items\[(\d+)\]\[(bridgeTransferId|document)\]$/
      );
      if (!match) continue;

      const index = Number(match[1]);
      const field = match[2];

      if (!items[index]) {
        items[index] = { bridgeTransferId: "", document: null as any };
      }

      if (field === "bridgeTransferId") {
        items[index].bridgeTransferId = formData.get(key) as string;
      }

      if (field === "document") {
        items[index].document = formData.get(key) as File;
      }
    }

    if (items.length === 0) {
      return BadRequestResponse;
    }

    const uploadDir = process.env.UPLOAD_DIR || "/uploads";
    fs.mkdirSync(uploadDir, { recursive: true });

    const forwardedHost =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const forwardedProto =
      request.headers.get("x-forwarded-proto") ||
      (process.env.NEXT_PUBLIC_APP_MODE === "production" ? "https" : "http");

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${forwardedProto}://${forwardedHost}`;

    const uploadedFiles: {
      bridgeTransferId: string;
      fileUrl: string;
    }[] = [];

    for (const item of items) {
      const file = item.document;

      if (!file || !item.bridgeTransferId) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const sanitizedFileName = file.name
        .replace(/[^a-z0-9_.-]/gi, "_")
        .toLowerCase();

      const fileName = `${Date.now()}-${id}-${
        item.bridgeTransferId
      }-${sanitizedFileName}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      const fileUrl = `${baseUrl}/uploads/${fileName}`;

      uploadedFiles.push({ bridgeTransferId: item.bridgeTransferId, fileUrl });

      await bridgeTransferService.updateById(item.bridgeTransferId, {
        documentUrl: fileUrl,
        status: "APPROVAL",
      });

      const bridge = await bridgeTransferService.getById(item.bridgeTransferId);

      if (bridge?.withdrawalId) {
        await withdrawalService.updateById(bridge.withdrawalId, {
          status: "APPROVAL",
        });
      }
    }

    const newDeposit = await depositService.updateById(id, {
      status: "AWAITING_APPROVAL",
    });

    return NextResponse.json(
      { deposit: newDeposit, uploadedFiles },
      { status: 200 }
    );
  } catch (error) {
    console.error("[UPLOAD_DEPOSIT_DOCUMENT]", error);
    return ServerErrorResponse;
  }
}
