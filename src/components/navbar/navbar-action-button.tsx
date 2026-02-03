"use client";

import { useAuthStore } from "@/lib/front/stores/auth";
import { useTranslations } from "next-intl";
import LoginSignupDialog from "../dialog/login-signup-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useResetApp } from "@/hooks/use-auth";
import {
  adminLoggedInNavbarItems,
  loggedInNavabarItems,
  notLoggedInNavbarItems,
  providerLoggedInNavbarItems,
} from "@/constants/globals";
import { Link, useRouter } from "@/i18n/navigation";

export default function NavbarActionButton() {
  const t = useTranslations("Sidebar");

  const resetApp = useResetApp();

  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();

  const items = isLoggedIn
    ? user?.role === "ADMIN"
      ? adminLoggedInNavbarItems
      : user?.role === "PROVIDER"
      ? providerLoggedInNavbarItems
      : loggedInNavabarItems
    : notLoggedInNavbarItems;
  if (isLoggedIn) {
    return (
      <>
        <div className="sm:block hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatarUrl || ""} />
                <AvatarFallback>
                  {user?.fullName
                    .split(" ")
                    .map((e) => e[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="text-muted-foreground">
                {t("menu")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.map((item) => (
                <DropdownMenuItem key={item.url} asChild className="w-40">
                  <Link href={item.url} className="">
                    <item.icon />
                    <span>{t(item.title)}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  resetApp();
                  router.replace("/");
                }}
                variant="destructive"
              >
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link href={"/dashboard"} className="sm:hidden">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatarUrl || ""} />
            <AvatarFallback>
              {user?.fullName
                .split(" ")
                .map((e) => e[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  }

  return <LoginSignupDialog />;
}
