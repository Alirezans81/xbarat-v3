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
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;

    const owns = await depositService.userOwnsTheDeposit(payload.id, id);
    if (!owns) return UnauthorizedResponse;

    const formData = await request.formData();

    const items: {
      bridgeTransferId: string;
      document: File;
    }[] = [];

    // parse items[n][field]
    for (const [key, value] of formData.entries()) {
      const match = key.match(
        /^items\[(\d+)\]\[(bridgeTransferId|document)\]$/
      );
      if (!match) continue;

      const index = Number(match[1]);
      const field = match[2];

      if (!items[index]) items[index] = {} as any;
      items[index][field as keyof (typeof items)[0]] = value as any;
    }

    if (!items.length) {
      return NextResponse.json({ error: "noFilesUploaded" }, { status: 400 });
    }

    // upload each file
    for (const item of items) {
      const file = item.document;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const sanitizedFileName = file.name
        .replace(/[^a-z0-9_.-]/gi, "_")
        .toLowerCase();

      const fileName = `${Date.now()}-${
        item.bridgeTransferId
      }-${sanitizedFileName}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

      const newBridgeTransfer = await bridgeTransferService.updateById(
        item.bridgeTransferId,
        {
          documentUrl: fileUrl,
          status: "APPROVAL",
        }
      );

      // if the bridge transfer is linked to a withdrawal, update its status too
      if (newBridgeTransfer.withdrawalId) {
        await withdrawalService.updateById(newBridgeTransfer.withdrawalId, {
          status: "APPROVAL",
        });
      }
    }

    // update deposit status
    const newDeposit = await depositService.updateById(id, {
      status: "AWAITING_APPROVAL",
    });

    return NextResponse.json(newDeposit, { status: 200 });
  } catch (error) {
    console.error("[UPLOAD_DEPOSIT_DOCUMENT]", error);
    return ServerErrorResponse;
  }
}
