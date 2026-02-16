"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="container mx-auto px-5 py-8 grid grid-cols-12 gap-6">
        <div className="col-span-3 bg-card rounded-xl flex flex-col gap-2 px-6 py-4">
          <span className="text-sm text-muted-foreground">PAGES</span>
          <Link href="/panel-admin/order/assignment">
            <Button
              variant={
                pathname !== "/panel-admin/order/assignment"
                  ? "outline"
                  : "default"
              }
              className="w-full justify-start"
            >
              Assignment
            </Button>
          </Link>
          {/* <Link href="/panel-admin/order/deposit">
            <Button
              variant={
                pathname !== "/panel-admin/order/deposit"
                  ? "outline"
                  : "default"
              }
              className="w-full justify-start"
            >
              Deposit
            </Button>
          </Link>
          <Link href="/panel-admin/order/withdrawal">
            <Button
              variant={
                pathname !== "/panel-admin/order/withdrawal"
                  ? "outline"
                  : "default"
              }
              className="w-full justify-start"
            >
              Withdrawal
            </Button>
          </Link>
          <Link href="/panel-admin/order/transfer">
            <Button
              variant={
                pathname !== "/panel-admin/order/transfer"
                  ? "outline"
                  : "default"
              }
              className="w-full justify-start"
            >
              Transfer
            </Button>
          </Link>
          <Link href="/panel-admin/order/refund">
            <Button
              variant={
                pathname !== "/panel-admin/order/refund" ? "outline" : "default"
              }
              className="w-full justify-start"
            >
              Refund
            </Button>
          </Link> */}
        </div>
        <div className="col-span-9 bg-card p-5 rounded-2xl">{children}</div>
      </div>
    </div>
  );
}
