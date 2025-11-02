import AddCurrencyDialog from "@/components/dialog/currency/add-currency-dialog";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCurrencies } from "@/api/currency/action";
import CurrenciesTable from "@/components/currency/currencies-table";

export default async function page() {
  try {
    const data = await getCurrencies();

    return (
      <div className="w-full">
        <div className="container mx-auto px-5 py-8 flex flex-col gap-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Link href="/panel-admin">
                <ChevronLeft />
              </Link>
              <span className="text-3xl">Currencies</span>
            </div>
            <AddCurrencyDialog />
          </div>

          <CurrenciesTable data={data} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("[CURRENCY_PAGE]", error);
    return (
      <div className="w-full h-full flex justify-center items-center">
        Internal server error
      </div>
    );
  }
}
