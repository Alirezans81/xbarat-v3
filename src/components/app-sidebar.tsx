"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";
import LocaleToggle from "./locale-toggle";
import { ThemeToggle } from "./theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  adminLoggedInNavbarItems,
  loggedInNavabarItems,
  notLoggedInNavbarItems,
  providerLoggedInNavbarItems,
} from "@/constants/globals";
import Image from "next/image";
import Glass from "./ui/glass";

interface Props {
  side?: "right" | "left";
}

function useSidebarItems() {
  const { isLoggedIn, user } = useAuthStore();

  return isLoggedIn
    ? user?.role === "ADMIN"
      ? adminLoggedInNavbarItems
      : user?.role === "PROVIDER"
        ? providerLoggedInNavbarItems
        : loggedInNavabarItems
    : notLoggedInNavbarItems;
}

export function AppSidebar({ side }: Props) {
  const t = useTranslations("Sidebar");
  const items = useSidebarItems();

  return (
    <Sidebar side={side}>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup>
          <SidebarGroupLabel>{t("menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="flex flex-col">
          <SidebarGroup className="">
            <SidebarGroupLabel>{t("socialMedia")}</SidebarGroupLabel>
            <SidebarGroupContent className="w-full flex items-center gap-3 px-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => { }}>
                    <Image
                      alt="Instagram"
                      src="/SocialMedia/instagram.svg"
                      className="size-5"
                      width={20}
                      height={20}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-foreground">{t("instagram")}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => { }}>
                    <Image
                      alt="WhatsApp"
                      src="/SocialMedia/whatsapp.svg"
                      className="size-5"
                      width={20}
                      height={20}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-foreground">{t("whatsApp")}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => { }}>
                    <Image
                      alt="Telegram"
                      src="/SocialMedia/telegram.svg"
                      className="size-5"
                      width={20}
                      height={20}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-foreground">{t("telegram")}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => { }}>
                    <div className="p-1.5 rounded-full bg-black">
                      <Image
                        alt="X"
                        src="/SocialMedia/x.svg"
                        className="size-2.5"
                        width={10}
                        height={10}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-foreground">{t("x")}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="p-3">
            <SidebarGroupContent className="w-full flex justify-between items-center">
              <LocaleToggle />
              <ThemeToggle />
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export function AppMobileNavbar() {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const items = useSidebarItems();
  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-0 bg-transparent">
      <div className="w-full h-full flex justify-center items-center p-3">
        <Glass className="w-full h-full rounded-full">
          <ul className="grid w-full rounded-full auto-cols-fr grid-flow-col px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
            {items.map((item) => {
              const isActive =
                item.url === "/"
                  ? pathname === "/" || pathname.split("/").length <= 2
                  : pathname === item.url || pathname.endsWith(item.url);

              return (
                <li key={`mobile-${item.title}`} className="min-w-0">
                  <Link
                    href={item.url}
                    className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] transition-colors ${isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <item.icon className="size-4" />
                    <span className="truncate">{t(item.title)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Glass>
      </div>
    </nav>
  );
}
