import {
  BridgeStatus,
  BridgeTransfer as DatabaseBridgeTransfer,
} from "@/generated/prisma";

export type BridgeTransfer = Omit<
  DatabaseBridgeTransfer,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
} & {
  deposit?: {
    amount: number;
    wallet: {
      user: {
        fullName: string;
      };
      currency: {
        code: string;
        name: string;
        symbol: string;
      };
    };
  };
  withdrawal?: {
    amount: number;
    receiverAddress: string;
    addressOwnerName: string;
    wallet: {
      currency: {
        code: string;
        name: string;
        symbol: string;
      };
    };
  };
  liquidityPool?: {
    address: string;
  };
};

export type GetBridgeTransfersFilters = {
  depositId?: string;
  channelId?: string;
  withdrawalId?: string;
  liquidityPoolId?: string;
  amount?: number;
  status?: BridgeStatus;
};

export type CreateBridgeTransfer = {
  depositId?: string;
  withdrawalId?: string;
  liquidityPoolId?: string;
  amount: number;
  status?: BridgeStatus;
};

export type UpdateBridgeTransfer = {
  depositId?: string;
  withdrawalId?: string;
  liquidityPoolId?: string;
  amount?: number;
  documentUrl?: string;
  status?: BridgeStatus;
  paymentChannelId?: string;
};
