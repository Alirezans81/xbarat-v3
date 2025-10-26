import { NextRequest, NextResponse } from "next/server";
import { withdrawalService } from "@/lib/back/services/wallet/withdrawal.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { bridgeTransferService } from "@/lib/back/services/bridgeTransfer.service";
import { depositService } from "@/lib/back/services/wallet/deposit.service";

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

    const userOwnsBridgeTransfer =
      await bridgeTransferService.userOwnsTheBridgeTransfer(payload.id, id);
    if (!userOwnsBridgeTransfer) return UnauthorizedResponse;

    // Update Bridge Transfer
    const newBridgeTransfer = await bridgeTransferService.updateById(id, {
      status: "COMPLETED",
    });

    // Update Deposit
    if (newBridgeTransfer.depositId) {
      await depositService.updateById(newBridgeTransfer.depositId, {
        status: "COMPLETED",
      });
    }

    return NextResponse.json(newBridgeTransfer, { status: 200 });
  } catch (error) {
    console.error("[UPLOAD_WITHDRAWAL_DOCUMENT]", error);
    return ServerErrorResponse;
  }
}
