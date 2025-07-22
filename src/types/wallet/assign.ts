import { LiquidityPool } from "../liquidityPool";
import { Deposit } from "./deposit";
import { Withdrawal } from "./withdrawal";

export type Assign = {
  deposits: Pick<Deposit, "id" | "amount">[];
  paymentChannelId: string;
  withdrawals: Pick<Withdrawal, "id" | "amount">[];
  liquidityPools: Pick<LiquidityPool, "id" | "balance">[];
};
