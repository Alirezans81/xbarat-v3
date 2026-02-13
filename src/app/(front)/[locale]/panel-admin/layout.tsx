"use client";

import { useAuthStore } from "@/lib/front/stores/auth";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuthStore();

  if (user && user.role === "ADMIN") {
    return <>{children}</>;
  }

  return <></>;
}
