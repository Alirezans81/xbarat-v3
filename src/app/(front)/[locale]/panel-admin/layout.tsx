"use client";

import { useAuthStore } from "@/lib/front/stores/auth";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    user,
    token: { value },
  } = useAuthStore();

  if (user && user.role === "ADMIN") {
    return <>{children}</>;
  }

  return <></>;
}
