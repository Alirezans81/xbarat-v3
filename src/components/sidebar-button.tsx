"use client";

import { useAuthStore } from "@/lib/front/stores/auth";
import { SidebarTrigger } from "./ui/sidebar";

export default function SidebarButton() {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return (
      <div className="sm:hidden flex justify-center items-center">
        <SidebarTrigger size="icon" className="" />
      </div>
    );
  }

  return <></>;
}
