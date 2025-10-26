"use client";

import { useAuthStore } from "@/lib/front/stores/auth";
import { useEffect } from "react";
import { useSetCookie, useDeleteCookie } from "cookies-next";

export default function HandleCookies() {
  const { token, user } = useAuthStore();

  const setCookie = useSetCookie();
  const deleteCookie = useDeleteCookie();

  useEffect(() => {
    token.value
      ? setCookie("token", JSON.stringify(token))
      : deleteCookie("token");
    user ? setCookie("user", JSON.stringify(user)) : deleteCookie("user");
  }, [token, user]);

  return <></>;
}
