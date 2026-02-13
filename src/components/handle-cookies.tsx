"use client";

import { useAuthStore } from "@/lib/front/stores/auth";
import { useEffect } from "react";
import { useSetCookie, useDeleteCookie } from "cookies-next";

export default function HandleCookies() {
  const { token, user } = useAuthStore();

  const setCookie = useSetCookie();
  const deleteCookie = useDeleteCookie();

  useEffect(() => {
    if (token.value) setCookie("token", JSON.stringify(token));
    else deleteCookie("token");

    if (user) setCookie("user", JSON.stringify(user));
    else deleteCookie("user");
  }, [deleteCookie, setCookie, token, user]);

  return <></>;
}
