"use client";

import { useGetDeposits } from "@/api/wallet/deposit/hook";
import { useEffect, useMemo, useState } from "react";
import { Deposit } from "@/types/front/wallet/deposit";
import { depositColumns } from "../../../../../../components/order/deposit/deposit-columns";
import { DepositDataTable } from "../../../../../../components/order/deposit/deposit-data-table";

export default function Page() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);

  const getDeposits = useGetDeposits();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getDeposits({
      setDeposits,
      onFinally() {
        setLoading(false);
      },
    });
  }, [getDeposits]);

  const trackableDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      if (
        deposit.status !== "PAYMENT" &&
        deposit.status !== "AWAITING_APPROVAL"
      )
        return false;
      return true;
    });
  }, [deposits]);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <span className="text-2xl">Trackable Deposits</span>
      <DepositDataTable
        columns={depositColumns}
        data={trackableDeposits}
        loading={loading}
      />
    </div>
  );
}
