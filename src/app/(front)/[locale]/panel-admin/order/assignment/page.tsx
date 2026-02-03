"use client";

import { DepositDataTable } from "./deposit/deposit-data-table";
import { depositColumns } from "./deposit/deposit-columns";
import { WithdrawalDataTable } from "./withdrawal/withdrawal-data-table";
import { withdrawalColumns } from "./withdrawal/withdrawal-columns";
 
import { LiquidityPoolDataTable } from "./liquidity-pool/liquidity-pool-data-table";
import { liquidityPoolColumns } from "./liquidity-pool/liquidity-pool-columns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Deposit } from "@/types/front/wallet/deposit";
import { Withdrawal } from "@/types/front/wallet/withdrawal";
import { LiquidityPool } from "@/types/front/liquidityPool";
import { useGetDeposits } from "@/api/wallet/deposit/hook";
import { useGetWithdrawals } from "@/api/wallet/withdrawal/hook";
import { useGetLiquidityPools } from "@/api/liquidity-pool/hook";
import { useGetCurrencies } from "@/api/currency/hook";
import { Currency } from "@/types/front/currency";
import { PaymentChannel } from "@/types/front/paymentChannel";
import { useGetPaymentChannels } from "@/api/payment-channel/hook";
import { useAssign } from "@/api/wallet/assign/hook";
import { toast } from "sonner";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentChannels, setPaymentChannels] = useState<PaymentChannel[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);

  const [selectedCurrencyId, setSelectedCurrencyId] = useState("");
  const [selectedPaymentChannelId, setSelectedPaymentChannelId] = useState("");

  const getCurrencies = useGetCurrencies();
  const getPaymentChannels = useGetPaymentChannels();
  const getDeposits = useGetDeposits();
  const getWithdrawals = useGetWithdrawals();
  const getLiquidityPools = useGetLiquidityPools();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getCurrencies({
      setCurrencies,
      onFinally() {
        setLoading(false);
      },
    });
  }, [getCurrencies]);

  useEffect(() => {
    if (selectedCurrencyId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      getPaymentChannels({
        setPaymentChannels,
        filters: {
          currencyId: selectedCurrencyId,
        },
        onFinally() {
          setLoading(false);
        },
      });
    }
  }, [selectedCurrencyId, getPaymentChannels]);

  useEffect(() => {
    if (selectedPaymentChannelId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      getDeposits({
        setDeposits,
        filters: {
          paymentChannelId: selectedPaymentChannelId,
          currencyId: selectedCurrencyId,
          status: "PENDING",
        },
        onSuccess() {
          getWithdrawals({
            setWithdrawals,
            filters: {
              paymentChannelId: selectedPaymentChannelId,
              currencyId: selectedCurrencyId,
              status: "PENDING",
            },
            onSuccess() {
              getLiquidityPools({
                setLiquidityPools,
                filters: {
                  paymentChannelId: selectedPaymentChannelId,
                  currencyId: selectedCurrencyId,
                },
                onFinally() {
                  setLoading(false);
                },
              });
            },
            onError() {
              setLoading(false);
            },
          });
        },
        onError() {
          setLoading(false);
        },
      });
    }
  }, [
    selectedPaymentChannelId,
    selectedCurrencyId,
    getDeposits,
    getWithdrawals,
    getLiquidityPools,
  ]);

  const [selectedDeposits, setSelectedDeposits] = useState<Deposit[]>([]);
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<Withdrawal[]>(
    []
  );
  const [selectedLiquidityPools, setSelectedLiquidityPools] = useState<
    LiquidityPool[]
  >([]);

  const assign = useAssign();
  const handleAssign = () => {
    assign({
      paymentChannelId: selectedPaymentChannelId,
      deposits: selectedDeposits,
      withdrawals: selectedWithdrawals,
      liquidityPools: selectedLiquidityPools,
      onSuccess: () => {
        setSelectedCurrencyId("");
        setSelectedPaymentChannelId("");
        setSelectedDeposits([]);
        setSelectedWithdrawals([]);
        setSelectedLiquidityPools([]);

        toast.success("Successfully assigned!");
      },
      onError(error) {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="w-full grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-3 items-center h-full">
        <span className="text-lg">Deposits</span>
        <div className="w-full flex-1">
          <DepositDataTable
            columns={depositColumns}
            data={deposits}
            loading={loading}
            onRowSelectionChange={setSelectedDeposits}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 items-center h-full">
        <span className="text-lg">Withdrawals</span>
        <div className="w-full flex-1">
          <WithdrawalDataTable
            columns={withdrawalColumns}
            data={withdrawals}
            loading={loading}
            onRowSelectionChange={setSelectedWithdrawals}
          />
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-3 items-center h-full">
        <span className="text-lg">Liquidity Pools</span>
        <div className="w-full flex-1">
          <LiquidityPoolDataTable
            columns={liquidityPoolColumns}
            data={liquidityPools}
            loading={loading}
            onRowSelectionChange={setSelectedLiquidityPools}
          />
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Select
            value={selectedCurrencyId}
            onValueChange={(value) => {
              setSelectedCurrencyId(value);
              setSelectedPaymentChannelId("");
              setDeposits([]);
              setWithdrawals([]);
              setLiquidityPools([]);
            }}
          >
            <SelectTrigger className="min-w-[8rem]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.id} value={currency.id}>
                  {currency.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedPaymentChannelId}
            onValueChange={setSelectedPaymentChannelId}
          >
            <SelectTrigger className="min-w-[8rem]">
              <SelectValue placeholder="Payment Channel" />
            </SelectTrigger>
            <SelectContent>
              {paymentChannels.map((paymentChannel) => (
                <SelectItem key={paymentChannel.id} value={paymentChannel.id}>
                  {paymentChannel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch disabled />
            <div className="flex flex-col">
              <span className="text-sm">Auto Assign</span>
              <span className="text-muted-foreground/50 text-xs">
                {"(Coming Soon)"}
              </span>
            </div>
          </div>
          <Button onClick={handleAssign}>
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
}
