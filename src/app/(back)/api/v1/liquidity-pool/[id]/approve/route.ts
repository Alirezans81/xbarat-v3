import { bridgeTransferService } from "./../../../../../../../lib/back/services/bridgeTransfer.service";
import { NextRequest, NextResponse } from "next/server";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { depositService } from "@/lib/back/services/wallet/deposit.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const body = await request.json();
    const { approvedBridgeTransfers } = body;

    if (!approvedBridgeTransfers || !Array.isArray(approvedBridgeTransfers))
      return MissingFieldsResponse;

    const newBridgeTransfers = await Promise.all(
      approvedBridgeTransfers.map(async (bridgeTransferId: string) => {
        const ownsBridgeTransfer =
          await bridgeTransferService.userOwnsTheBridgeTransfer(
            payload.id,
            bridgeTransferId
          );
        if (!ownsBridgeTransfer) return UnauthorizedResponse;

        console.log();

        const newBridgeTransfer = await bridgeTransferService.updateById(
          bridgeTransferId,
          {
            status: "COMPLETED",
          }
        );

        if (newBridgeTransfer.depositId) {
          await depositService.updateById(newBridgeTransfer.depositId, {
            status: "COMPLETED",
          });
        }

        return newBridgeTransfer;
      })
    );

    return NextResponse.json(newBridgeTransfers, { status: 200 });
  } catch (error) {
    console.error("[APPROVE_BRIDGE_TRANSFERS]", error);
    return ServerErrorResponse;
  }
}
