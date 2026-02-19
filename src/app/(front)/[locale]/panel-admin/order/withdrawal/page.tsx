"use client";

import { useGetWithdrawals } from "@/api/wallet/withdrawal/hook";
import { useEffect, useMemo, useState } from "react";
import { Withdrawal } from "@/types/front/wallet/withdrawal";
import { withdrawalColumns } from "../../../../../../components/order/withdrawal/withdrawal-columns";
import { WithdrawalDataTable } from "../../../../../../components/order/withdrawal/withdrawal-data-table";

export default function Page() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);

  const getWithdrawals = useGetWithdrawals();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getWithdrawals({
      setWithdrawals,
      onFinally() {
        setLoading(false);
      },
    });
  }, [getWithdrawals]);

  const trackableWithdrawals = useMemo(() => {
    return withdrawals.filter((withdrawal) => {
      if (
        withdrawal.status !== "AWAITING_PAYMENT" &&
        withdrawal.status !== "APPROVAL"
      )
        return false;
      return true;
    });
  }, [withdrawals]);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <span className="text-2xl">Trackable Withdrawals</span>
      <WithdrawalDataTable
        columns={withdrawalColumns}
        data={trackableWithdrawals}
        loading={loading}
      />
    </div>
  );
}
