import { NextRequest, NextResponse } from "next/server";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { bridgeTransferService } from "@/lib/back/services/bridgeTransfer.service";
import { depositService } from "@/lib/back/services/wallet/deposit.service";

export const runtime = "nodejs";

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

    const userOwnsDeposit = await depositService.userOwnsTheDeposit(
      payload.id,
      id
    );
    if (!userOwnsDeposit) return UnauthorizedResponse;

    const matchedBridgeTransfers = await bridgeTransferService.getAll({
      depositId: id,
    });

    return NextResponse.json(matchedBridgeTransfers, { status: 200 });
  } catch (error) {
    console.error("[GET_MATCHED_BRIDGE_TRANSFERS]", error);
    return ServerErrorResponse;
  }
}
