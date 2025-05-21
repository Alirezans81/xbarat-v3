"use client";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";

export default function layout({
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
          <Link href="/wallet">
            <Button
              variant={pathname !== "/wallet" ? "outline" : "default"}
              className="w-full cursor-pointer justify-start text-foreground"
            >
              Overview
            </Button>
          </Link>
          <Link href="/wallet/deposit">
            <Button
              variant={pathname !== "/wallet/deposit" ? "outline" : "default"}
              className="w-full cursor-pointer justify-start text-foreground"
            >
              Deposit
            </Button>
          </Link>
          <Link href="/wallet/withdrawal">
            <Button
              variant={
                pathname !== "/wallet/withdrawal" ? "outline" : "default"
              }
              className="w-full cursor-pointer justify-start text-foreground"
            >
              Withdrawal
            </Button>
          </Link>
          <Link href="/wallet/transfer">
            <Button
              variant={pathname !== "/wallet/transfer" ? "outline" : "default"}
              className="w-full cursor-pointer justify-start text-foreground"
            >
              Transfer
            </Button>
          </Link>
        </div>
        <div className="col-span-9">{children}</div>
      </div>
    </div>
  );
}
