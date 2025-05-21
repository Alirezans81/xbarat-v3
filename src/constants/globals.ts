import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  FileStack,
  Home,
  LayoutDashboard,
  MonitorCog,
  Wallet,
} from "lucide-react";
import { CountryCode } from "../types/globals";

export const countryCodes: CountryCode[] = [
  { code: "US", name: "United States", phoneCode: "+1", symbol: "🇺🇸" },
  { code: "CA", name: "Canada", phoneCode: "+1", symbol: "🇨🇦" },
  { code: "IR", name: "Iran", phoneCode: "+98", symbol: "🇮🇷" },
];

export const notLoggedInNavbarItems = [
  {
    title: "home",
    url: "/",
    icon: Home,
  },
  {
    title: "dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];
export const loggedInNavabarItems = [
  {
    title: "home",
    url: "/",
    icon: Home,
  },
  {
    title: "wallet",
    url: "/wallet",
    icon: Wallet,
  },
  {
    title: "deposit",
    url: "/deposit",
    icon: BanknoteArrowDown,
  },
  {
    title: "withdrawal",
    url: "/withdrawal",
    icon: BanknoteArrowUp,
  },
  {
    title: "report",
    url: "/report",
    icon: FileStack,
  },
  {
    title: "dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];
export const adminLoggedInNavbarItems = [
  {
    title: "home",
    url: "/",
    icon: Home,
  },
  {
    title: "wallet",
    url: "/wallet",
    icon: Wallet,
  },
  {
    title: "deposit",
    url: "/deposit",
    icon: BanknoteArrowDown,
  },
  {
    title: "withdrawal",
    url: "/withdrawal",
    icon: BanknoteArrowUp,
  },
  {
    title: "report",
    url: "/report",
    icon: FileStack,
  },
  {
    title: "dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "panelAdmin",
    url: "/panel-admin",
    icon: MonitorCog,
  },
];
