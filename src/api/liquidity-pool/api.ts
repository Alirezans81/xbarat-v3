import axios from "axios";
import routes from "@/api/routes";
import {
  CreateLiquidityPool,
  UpdateLiquidityPool,
} from "@/types/front/liquidityPool";

const api = routes();

export const getLiquidityPools = (token: string, filters?: any) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(api["liquidity-pool"], { headers, params: filters });
};

export const createLiquidityPool = (
  token: string,
  liquidityPool: CreateLiquidityPool
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(api["liquidity-pool"], liquidityPool, { headers });
};

export const updateLiquidityPool = (
  token: string,
  liquidityPool_id: string,
  liquidityPool: UpdateLiquidityPool
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.put(
    api["liquidity-pool"] + "/" + liquidityPool_id,
    liquidityPool,
    { headers }
  );
};

export const deleteLiquidityPool = (
  token: string,
  liquidityPool_id: string
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.delete(api["liquidity-pool"] + "/" + liquidityPool_id, {
    headers,
  });
};
