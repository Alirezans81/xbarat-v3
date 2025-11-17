import { getCurrencies } from "@/api/currency/action";
import { getCurrencyPairs } from "@/api/currency-pair/action";
import { getPaymentChannels } from "@/api/payment-channel/action";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getFeeUsers } from "@/api/fee-user/action";

export default async function page() {
  try {
    const currencies = await getCurrencies();
    const paymentChannels = await getPaymentChannels();
    const currencyPairs = await getCurrencyPairs();
    const feeUsers = await getFeeUsers();

    return (
      <div className="w-full">
        <div className="container mx-auto px-5 py-8 flex flex-col gap-4">
          <span className="text-3xl">Panel Admin</span>
          <div className="grid grid-cols-4 gap-3">
            <Link href="/panel-admin/payment-channel">
              <Card className="hover:shadow-xl h-44 transition-all duration-300 dark:hover:shadow-secondary/10">
                <CardHeader>
                  <CardTitle>Payment Channels</CardTitle>
                  <CardDescription>
                    Users can send their money thruogh payment channels{" "}
                    {"(Platofrms like: PayPal, Shaba, HesabPay...)"}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <p className="">{paymentChannels.length} channels</p>
                </CardFooter>
              </Card>
            </Link>
            <Link href="/panel-admin/currency">
              <Card className="hover:shadow-xl h-44 transition-all duration-300 dark:hover:shadow-secondary/10">
                <CardHeader>
                  <CardTitle>Currencies</CardTitle>
                  <CardDescription>All Currency Settings</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <p className="">{currencies.length} currencies</p>
                </CardFooter>
              </Card>
            </Link>
            <Link href="/panel-admin/currency-pair">
              <Card className="hover:shadow-xl h-44 transition-all duration-300 dark:hover:shadow-secondary/10">
                <CardHeader>
                  <CardTitle>Currency Pairs</CardTitle>
                  <CardDescription>All Currency Pair Settings</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <p className="">{currencyPairs.length} pairs</p>
                </CardFooter>
              </Card>
            </Link>
            <Link href="/panel-admin/order">
              <Card className="hover:shadow-xl h-44 transition-all duration-300 dark:hover:shadow-secondary/10">
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    All Orders, including: Deposits, Withdrawals, Transfer and
                    Refunds
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/panel-admin/fee-user">
              <Card className="hover:shadow-xl h-44 transition-all duration-300 dark:hover:shadow-secondary/10">
                <CardHeader>
                  <CardTitle>Fee Users</CardTitle>
                  <CardDescription>What user can get the fee</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <p className="">{feeUsers.length} users</p>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div>Error loading data</div>;
  }
}
