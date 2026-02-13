import { NextRequest, NextResponse } from "next/server";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { bridgeTransferService } from "@/lib/back/services/bridgeTransfer.service";
import { withdrawalService } from "@/lib/back/services/wallet/withdrawal.service";
import { r2 } from "@/lib/back/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sanitizedFileName = file.name
      .replace(/[^a-z0-9_.-]/gi, "_")
      .toLowerCase();

    const fileName = `${Date.now()}-${id}-${sanitizedFileName}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

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
