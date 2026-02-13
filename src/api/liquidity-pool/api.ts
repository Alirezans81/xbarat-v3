import routes from "@/api/routes";
import { apiFetch } from "@/lib/front/utils/apiFetch";
import { Token } from "@/types/front/globals";
import {
  CreateLiquidityPool,
  GetLiquidityPoolsFilters,
  LiquidityPool,
  UpdateLiquidityPool,
} from "@/types/front/liquidityPool";

const api = routes();

export const getLiquidityPools = (
  token: Token,
  filters?: GetLiquidityPoolsFilters
) => {
  return apiFetch<LiquidityPool[]>(api["liquidity-pool"], {
    params: filters,
    token,
  });
};

export const createLiquidityPool = (
  token: Token,
  liquidityPool: CreateLiquidityPool
) => {
  return apiFetch<LiquidityPool>(api["liquidity-pool"], {
    method: "POST",
    body: liquidityPool,
    token,
  });
};

export const updateLiquidityPool = (
  token: Token,
  liquidityPool_id: string,
  liquidityPool: UpdateLiquidityPool
) => {
  return apiFetch<LiquidityPool>(
    api["liquidity-pool"] + "/" + liquidityPool_id,
    {
      method: "PUT",
      body: liquidityPool,
      token,
    }
  );
};

export const deleteLiquidityPool = (token: Token, liquidityPool_id: string) => {
  return apiFetch<LiquidityPool>(
    api["liquidity-pool"] + "/" + liquidityPool_id,
    {
      method: "DELETE",
      token,
    }
  );
};

export const approveLiquidityPoolDocument = (
  token: Token,
  liquidityPool_id: string,
  approvedBridgeTransfers: string[]
) => {
  return apiFetch<LiquidityPool>(
    api["liquidity-pool"] + "/" + liquidityPool_id + "/approve",
    {
      method: "POST",
      token,
      body: { approvedBridgeTransfers },
    }
  );
};

export const uploadLiquidityPoolDocument = (
  token: Token,
  liquidityPool_id: string,
  data: { document: File }
) => {
  const formData = new FormData();
  formData.append("document", data.document);

  return apiFetch<LiquidityPool>(
    api["liquidity-pool"] + "/" + liquidityPool_id + "/upload",
    {
      method: "POST",
      body: formData,
      token,
    }
  );
};
