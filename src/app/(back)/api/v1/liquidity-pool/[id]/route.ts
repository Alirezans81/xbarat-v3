import { liquidityPoolService } from "@/lib/back/services/liquidityPool.service";
import { userService } from "@/lib/back/services/user.service";
import {
  NotFoundResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";

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
    const liquidityPool = await liquidityPoolService.getById(id);
    if (!liquidityPool)
      return NextResponse.json(
        { message: "liquidityPoolNotFound" },
        { status: 404 }
      );

    return NextResponse.json(liquidityPool, { status: 200 });
  } catch (error) {
    console.error("[GET_LIQUIDITY_POOL]", error);
    return ServerErrorResponse;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    if (!userIsAdmin) return UnauthorizedResponse;

    const { id } = await params;
    const body = await request.json();
    const { currencyId, paymentChannelId, address, balance } = body;

    const newLiquidityPool = await liquidityPoolService.updateById(id, {
      currencyId,
      paymentChannelId,
      address,
      balance,
    });

    return NextResponse.json(newLiquidityPool, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_LIQUIDITY_POOL]", error);
    return ServerErrorResponse;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    const userIsProvider = await userService.checkUserIsProvider(payload.id);

    const { id } = await params;

    if (userIsAdmin) {
      const deletedLiquidityPool = await liquidityPoolService.deleteById(id);
      return NextResponse.json(deletedLiquidityPool, { status: 200 });
    }

    if (userIsProvider) {
      const deletedOwnedLiquidityPool =
        await liquidityPoolService.deleteOwnedById(id, payload.id);

      if (deletedOwnedLiquidityPool instanceof Error) {
        if (deletedOwnedLiquidityPool.message === "notFound") {
          return NotFoundResponse;
        } else if (deletedOwnedLiquidityPool.message === "unauthorized") {
          return UnauthorizedResponse;
        }
      }

      return NextResponse.json(deletedOwnedLiquidityPool, { status: 200 });
    }

    return UnauthorizedResponse;
  } catch (error) {
    console.error("[DELETE_LIQUIDITY_POOL]", error);
    return ServerErrorResponse;
  }
}
