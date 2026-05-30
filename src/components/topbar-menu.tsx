"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/lib/front/stores/auth";
import { useTranslations } from "next-intl";

export default function TopbarMenu() {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  const { isLoggedIn, user } = useAuthStore();

  if (isLoggedIn) {
    return (
      <NavigationMenu>
        <NavigationMenuList className="space-x-4 text-muted-foreground">
          <NavigationMenuItem>
            <NavigationMenuLink href="/" asChild className="px-4">
              <Link
                href="/"
                className={pathname === "/" ? "text-foreground" : ""}
              >
                {t("home")}
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
                  {t("liquidityPool")}
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
                  {t("wallet")}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
          {/* <NavigationMenuItem>
            <NavigationMenuLink href="/profile" asChild className="px-4">
              <Link
                href="/profile"
                className={pathname === "/profile" ? "text-foreground" : ""}
              >
                {t("profile")}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return <></>;
}
