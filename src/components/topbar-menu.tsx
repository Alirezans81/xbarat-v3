"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/lib/front/stores/auth";

export default function TopbarMenu() {
  const pathname = usePathname();

  const { isLoggedIn, user } = useAuthStore();

  if (isLoggedIn) {
    return (
      <NavigationMenu>
        <NavigationMenuList className="space-x-3 text-muted-foreground">
          <NavigationMenuItem>
            <NavigationMenuLink href="/" asChild className="px-4">
              <Link
                href="/"
                className={pathname === "/" ? "text-foreground" : ""}
              >
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {user?.role === "PROVIDER" ? (
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/liquidity-pool"
                asChild
                className="px-4"
              >
                <Link
                  href="/liquidity-pool"
                  className={
                    pathname === "/liquidity-pool" ? "text-foreground" : ""
                  }
                >
                  Liquidity Pool
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuLink href="/wallet" asChild className="px-4">
                <Link
                  href="/wallet"
                  className={pathname === "/wallet" ? "text-foreground" : ""}
                >
                  Wallet
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
          {/* <NavigationMenuItem>
            <NavigationMenuLink href="/dashboard" asChild className="px-4">
              <Link
                href="/dashboard"
                className={pathname === "/dashboard" ? "text-foreground" : ""}
              >
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return <></>;
}
