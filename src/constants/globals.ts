import {
  FileStack,
  Home,
  LayoutDashboard,
  MonitorCog,
  Wallet,
  WavesLadder,
  // User
} from "lucide-react";
import { CountryCode } from "../types/front/globals";

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
  // {
  //   title: "dashboard",
  //   url: "/dashboard",
  //   icon: LayoutDashboard,
  // },
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
  // {
  //   title: "report",
  //   url: "/report",
  //   icon: FileStack,
  // },
  // {
  //   title: "dashboard",
  //   url: "/dashboard",
  //   icon: LayoutDashboard,
  // },
  // {
  //   title: "profile",
  //   url: "/profile",
  //   icon: User,
  // },
];
export const adminLoggedInNavbarItems = [
  {
    title: "home",
    url: "/",
    icon: Home,
  },
  {
    title: "panelAdmin",
    url: "/panel-admin",
    icon: MonitorCog,
  },
  {
    title: "wallet",
    url: "/wallet",
    icon: Wallet,
  },
  // {
  //   title: "report",
  //   url: "/report",
  //   icon: FileStack,
  // },
  // {
  //   title: "dashboard",
  //   url: "/dashboard",
  //   icon: LayoutDashboard,
  // },
];
export const providerLoggedInNavbarItems = [
  {
    title: "home",
    url: "/",
    icon: Home,
  },
  {
    title: "liquidityPool",
    url: "/liquidity-pool",
    icon: WavesLadder,
  },
  // {
  //   title: "wallet",
  //   url: "/wallet",
  //   icon: Wallet,
  // },
  // {
  //   title: "report",
  //   url: "/report",
  //   icon: FileStack,
  // },
  // {
  //   title: "dashboard",
  //   url: "/dashboard",
  //   icon: LayoutDashboard,
  // },
];
