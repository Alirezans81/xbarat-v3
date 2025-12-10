import { NextResponse, NextRequest } from "next/server";
import { exchangeService } from "@/lib/back/services/wallet/exchange.service";
import { ServerErrorResponse } from "@/lib/back/utils/globalResponses.utils";
import { GetExchangesFilters } from "@/types/back/wallet/exchange";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ currencyPairId: string }> }
) {
  try {
    const { currencyPairId } = await params;
    const filters: GetExchangesFilters = {
      currencyPairId: currencyPairId || undefined,
    };
    const lastOrders = await exchangeService.getLast(filters);
    return NextResponse.json(lastOrders, { status: 200 });
  } catch (error) {
    console.error("[GET_LAST_ORDERS]", error);
    return ServerErrorResponse;
  }
}
