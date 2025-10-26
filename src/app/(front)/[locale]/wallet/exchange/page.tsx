import { getExchanges } from "@/api/wallet/exchange/action";
import ExchangeTable from "@/components/wallet/exchange/exchange-table";

export default async function page() {
  try {
    const { data } = await getExchanges();

    return (
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-3xl">Exchange</span>
          </div>
        </div>

        <ExchangeTable data={data} />
      </div>
    );
  } catch (error) {
    console.error("[EXCHANGE_PAGE]", error);
    return (
      <div className="w-full h-full flex justify-center items-center">
        Internal server error
      </div>
    );
  }
}
