"use client";

import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  FileStack,
  Home,
  Wallet,
} from "lucide-react";

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
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/store";
import LocaleToggle from "./locale-toggle";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import Instagram from "@/assets/SocialMedia/instagram.svg";
import WhatsApp from "@/assets/SocialMedia/whatsapp.svg";
import Telegram from "@/assets/SocialMedia/telegram.svg";
import X from "@/assets/SocialMedia/x.svg";

interface Props {
  side?: "right" | "left";
}
export function AppSidebar({ side }: Props) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const t = useTranslations("Sidebar");

  const items = isLoggedIn
    ? [
        {
          title: t("home"),
          url: "/",
          icon: Home,
        },
        {
          title: t("wallet"),
          url: "/wallet",
          icon: Wallet,
        },
        {
          title: t("deposit"),
          url: "/deposit",
          icon: BanknoteArrowDown,
        },
        {
          title: t("withdrawal"),
          url: "/withdrawal",
          icon: BanknoteArrowUp,
        },
        {
          title: t("report"),
          url: "/report",
          icon: FileStack,
        },
      ]
    : [
        {
          title: t("home"),
          url: "/",
          icon: Home,
        },
      ];

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
                      <span>{item.title}</span>
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
                  <TooltipTrigger onClick={() => {}}>
                    <Image alt="" src={Instagram} className="size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-foreground">{t("instagram")}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => {}}>
                    <Image alt="" src={WhatsApp} className="size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-foreground">{t("whatsApp")}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => {}}>
                    <Image alt="" src={Telegram} className="size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-foreground">{t("telegram")}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => {}}>
                    <div className="p-1.5 rounded-full bg-black">
                      <Image alt="" src={X} className="size-2.5" />
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
