import { NextRequest, NextResponse } from "next/server";
import { depositService } from "@/lib/back/services/wallet/deposit.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { bridgeTransferService } from "@/lib/back/services/bridgeTransfer.service";
import { withdrawalService } from "@/lib/back/services/wallet/withdrawal.service";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/back/r2";

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
    const file = formData.get("document") as File;

    if (!file) {
      return NextResponse.json({ error: "noFileUploaded" }, { status: 400 });
    }

    // prepare buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sanitizedFileName = file.name
      .replace(/[^a-z0-9_.-]/gi, "_")
      .toLowerCase();

    const fileName = `${Date.now()}-${id}-${sanitizedFileName}`;

    // upload to R2
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // generate public URL
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    // update services
    const bridgeTransfers = await bridgeTransferService.getAll({
      depositId: id,
    });

    for (const bridgeTransfer of bridgeTransfers) {
      await bridgeTransferService.updateById(bridgeTransfer.id, {
        documentUrl: fileUrl,
        status: "APPROVAL",
      });

      if (bridgeTransfer.withdrawalId) {
        await withdrawalService.updateById(bridgeTransfer.withdrawalId, {
          documentUrl: fileUrl,
          status: "APPROVAL",
        });
      }
    }

    const newDeposit = await depositService.updateById(id, {
      documentUrl: fileUrl,
      status: "AWAITING_APPROVAL",
    });

    return NextResponse.json(newDeposit, { status: 200 });
  } catch (error) {
    console.error("[UPLOAD_DEPOSIT_DOCUMENT]", error);
    return ServerErrorResponse;
  }
}
