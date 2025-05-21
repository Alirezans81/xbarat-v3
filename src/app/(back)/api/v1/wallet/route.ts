import { walletService } from "@/lib/back/services/wallet.service";
import {
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/global-responses";
import { jwtUtils } from "@/lib/back/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return UnauthorizedResponse;
    }

    const payload = jwtUtils.verify(token);
    if (!payload) {
      return UnauthorizedResponse;
    }

    const wallets = await walletService.getUserWallets(payload.id);
    return NextResponse.json(wallets, { status: 200 });
  } catch (error) {
    console.error("[GET_WALLETS]", error);
    return ServerErrorResponse;
  }
}
