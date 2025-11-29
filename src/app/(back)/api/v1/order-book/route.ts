import { NextResponse, NextRequest } from "next/server";
import { exchangeService } from "@/lib/back/services/wallet/exchange.service";
import { ServerErrorResponse } from "@/lib/back/utils/globalResponses.utils";

export async function GET() {
  try {
    const lastOrders = await exchangeService.getLast();
    return NextResponse.json(lastOrders, { status: 200 });
  } catch (error) {
    console.error("[GET_LAST_ORDERS]", error);
    return ServerErrorResponse;
  }
}
