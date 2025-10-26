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
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const { id } = await params;

    const userOwnsWithdrawal = await withdrawalService.userOwnsTheWithdrawal(
      payload.id,
      id
    );
    if (!userOwnsWithdrawal) return UnauthorizedResponse;

    // Update Bridge Transfers
    const bridgeTransfers = await bridgeTransferService.getAll({
      withdrawalId: id,
    });
    for (const bridgeTransfer of bridgeTransfers) {
      await bridgeTransferService.updateById(bridgeTransfer.id, {
        status: "COMPLETED",
      });

      if (bridgeTransfer.depositId) {
        await depositService.updateById(bridgeTransfer.depositId, {
          status: "COMPLETED",
        });
      }
    }

    // Update withdrawal
    const newWithdrawal = await withdrawalService.updateById(id, {
      status: "COMPLETED",
    });

    return NextResponse.json(newWithdrawal, { status: 200 });
  } catch (error) {
    console.error("[UPLOAD_WITHDRAWAL_DOCUMENT]", error);
    return ServerErrorResponse;
  }
}
