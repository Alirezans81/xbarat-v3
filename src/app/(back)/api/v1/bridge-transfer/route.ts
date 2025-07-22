import { BridgeStatus, BridgeTransfer } from "@/generated/prisma";
import { bridgeTransferService } from "@/lib/back/services/bridgeTransfer.service";
import { liquidityPoolService } from "@/lib/back/services/liquidityPool.service";
import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { GetBridgeTransfersFilters } from "@/types/bridgeTransfer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    const userIsProvider = await userService.checkUserIsProvider(payload.id);

    const searchParams = request.nextUrl.searchParams;

    if (userIsAdmin) {
      const filters: GetBridgeTransfersFilters = {
        amount: +(searchParams.get("amount") ?? "0") || undefined,
        channelId: searchParams.get("channelId") || undefined,
        depositId: searchParams.get("depositId") || undefined,
        liquidityPoolId: searchParams.get("liquidityPoolId") || undefined,
        status: (searchParams.get("status") as BridgeStatus) || undefined,
        withdrawalId: searchParams.get("withdrawalId") || undefined,
      };

      const bridgeTransfers = await bridgeTransferService.getAll(filters);
      return NextResponse.json(bridgeTransfers, { status: 200 });
    }

    if (userIsProvider) {
      const liquidityPoolId = searchParams.get("liquidityPoolId");

      if (liquidityPoolId) {
        const bridgeTransfers = await bridgeTransferService.getAll({
          liquidityPoolId,
        });

        return NextResponse.json(bridgeTransfers, { status: 200 });
      }

      const liquidityPools = await liquidityPoolService.getAll({
        userId: payload.id,
      });
      let bridgeTransfers: BridgeTransfer[] = [];
      for (const pool of liquidityPools) {
        const transfers = await bridgeTransferService.getAll({
          liquidityPoolId: pool.id,
        });
        bridgeTransfers = bridgeTransfers.concat(transfers);
      }
      return NextResponse.json(bridgeTransfers, { status: 200 });
    }

    return UnauthorizedResponse;
  } catch (error) {
    console.error("[GET_BRIDGE_TRANSFERS]", error);
    return ServerErrorResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsProvider = await userService.checkUserIsProvider(payload.id);
    if (!userIsProvider) return UnauthorizedResponse;

    const body = await request.json();
    const {
      amount,
      paymentChannelId,
      depositId,
      liquidityPoolId,
      status,
      withdrawalId,
    } = body;
    if (
      !amount ||
      !paymentChannelId ||
      !depositId ||
      liquidityPoolId === undefined ||
      status === undefined ||
      withdrawalId === undefined
    )
      return MissingFieldsResponse;

    const bridgeTransfer = await bridgeTransferService.create({
      amount,
      depositId,
      liquidityPoolId,
      status,
      withdrawalId,
    });

    return NextResponse.json(bridgeTransfer, { status: 201 });
  } catch (error) {
    console.error("[CREATE_BRIDGE_TRANSFER]", error);
    return ServerErrorResponse;
  }
}
