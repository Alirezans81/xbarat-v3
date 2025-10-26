import { Deposit, LiquidityPool, Withdrawal } from "@/generated/prisma";
import {
  MissingFieldsResponse,
  ServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/back/utils/globalResponses.utils";
import { jwtUtils } from "@/lib/back/utils/jwt.utils";
import { NextRequest, NextResponse } from "next/server";
import { assignBridgeTransfers } from "@/lib/back/utils/assignment.utils";
import { bridgeTransferService } from "@/lib/back/services/bridgeTransfer.service";
import { depositService } from "@/lib/back/services/wallet/deposit.service";
import { withdrawalService } from "@/lib/back/services/wallet/withdrawal.service";
import { liquidityPoolService } from "@/lib/back/services/liquidityPool.service";
import { userService } from "@/lib/back/services/user.service";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) return UnauthorizedResponse;

    const payload = jwtUtils.verify(token);
    if (!payload) return UnauthorizedResponse;

    const userIsAdmin = await userService.checkUserIsAdmin(payload.id);
    if (!userIsAdmin) return UnauthorizedResponse;

    const body = await request.json();
    const {
      deposits,
      paymentChannelId,
      withdrawals,
      liquidityPools,
    }: {
      deposits: Pick<Deposit, "id" | "amount">[];
      paymentChannelId: string;
      withdrawals: Pick<Withdrawal, "id" | "amount">[];
      liquidityPools: Pick<LiquidityPool, "id" | "balance">[];
    } = body;

    if (!deposits || !paymentChannelId || !withdrawals || !liquidityPools)
      return MissingFieldsResponse;

    const assigned = assignBridgeTransfers(
      deposits,
      withdrawals,
      liquidityPools
    ).map(({ depositId, withdrawalId, liquidityPoolId, amount }) => ({
      amount: +amount,
      ...(depositId != null ? { depositId: depositId } : {}),
      ...(withdrawalId != null ? { withdrawalId: withdrawalId } : {}),
      ...(liquidityPoolId != null ? { liquidityPoolId: liquidityPoolId } : {}),
    }));

    const bridgeTransfers = await bridgeTransferService.createMany(assigned);

    await Promise.allSettled(
      assigned.map((transfer) => {
        if (transfer.depositId) {
          depositService.updateById(transfer.depositId, {
            status: "PAYMENT",
          });
        }

        if (transfer.withdrawalId) {
          withdrawalService.updateById(transfer.withdrawalId, {
            status: "AWAITING_PAYMENT",
          });

          if (transfer.liquidityPoolId) {
            liquidityPoolService
              .getById(transfer.liquidityPoolId)
              .then((liquidityPool) => {
                if (liquidityPool) {
                  liquidityPoolService.updateById(liquidityPool.id, {
                    balance: +liquidityPool.balance - transfer.amount,
                    frozen: +liquidityPool.frozen + transfer.amount,
                  });
                }
              });
          }
        }
      })
    );

    return NextResponse.json(bridgeTransfers, { status: 200 });
  } catch (error) {
    console.error("[ASSIGN]", error);
    return ServerErrorResponse;
  }
}
