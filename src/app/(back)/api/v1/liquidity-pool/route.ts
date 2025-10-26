import { liquidityPoolService } from "@/lib/back/services/liquidityPool.service";
import { userService } from "@/lib/back/services/user.service";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { GetLiquidityPoolsFilters } from "@/types/front/liquidityPool";
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
      const filters: GetLiquidityPoolsFilters = {
        userId: searchParams.get("userId") || undefined,
        currencyId: searchParams.get("currencyId") || undefined,
        paymentChannelId: searchParams.get("paymentChannelId") || undefined,
      };

      const liquidityPools = await liquidityPoolService.getAll(filters);
      return NextResponse.json(liquidityPools, { status: 200 });
    }

    if (userIsProvider) {
      const currencyId = searchParams.get("currencyId");

      if (currencyId) {
        const liquidityPools = await liquidityPoolService.getAll({
          userId: payload.id,
          currencyId,
        });
        return NextResponse.json(liquidityPools, { status: 200 });
      }

      const liquidityPools = await liquidityPoolService.getAll({
        userId: payload.id,
      });
      return NextResponse.json(liquidityPools, { status: 200 });
    }

    return UnauthorizedResponse;
  } catch (error) {
    console.error("[GET_LIQUIDITY_POOLS]", error);
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
    const { currencyId, paymentChannelId, address, balance } = body;
    if (!currencyId || !paymentChannelId || !address || balance === undefined)
      return MissingFieldsResponse;

    const liquidityPool = await liquidityPoolService.create({
      userId: payload.id,
      currencyId,
      paymentChannelId,
      address,
      balance,
      frozen: 0,
    });

    return NextResponse.json(liquidityPool, { status: 201 });
  } catch (error) {
    console.error("[CREATE_LIQUIDITY_POOL]", error);
    return ServerErrorResponse;
  }
}
