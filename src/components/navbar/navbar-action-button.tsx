"use client";

import { useAuthStore } from "@/lib/store";
import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import LoginSignupDialog from "../dialog/login-signup-dialog";
import { Link } from "@/i18n/navigation";

export default function NavbarActionButton() {
  const t = useTranslations("Navbar");

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return (
      <Link href="/dashboard" className="bg-gray-200 border rounded-full p-2">
        <UserRound color="#333" className="w-5 h-5" />
      </Link>
    );
  }

  return <LoginSignupDialog />;
}
