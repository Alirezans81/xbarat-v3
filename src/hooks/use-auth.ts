import { useAuthStore } from "@/lib/front/stores/auth";
import { useLoginSignupDialogStore } from "@/lib/front/stores/dialog";
import { defaultToken } from "@/types/front/globals";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";

export function useResetApp() {
  const { setIsLoggedIn, setToken, setUser } = useAuthStore();

  return useCallback(() => {
    setIsLoggedIn(false);
    setToken(defaultToken);
    setUser(null);
  }, [setIsLoggedIn, setToken, setUser]);
}

export function useCheckTokenExpiration() {
  const { token } = useAuthStore();
  const resetApp = useResetApp();
  const { setOpen, setMode } = useLoginSignupDialogStore();
  const t = useTranslations("Other");

  return useCallback(
    (onSuccess: () => void) => {
      const now = new Date();

      if (token && token.expiration && now < new Date(token.expiration)) {
        onSuccess();
      } else {
        resetApp();

        toast.info(t("mustLoginAgain"));
        setMode("login");
        setOpen(true);
      }
    },
    [resetApp, setMode, setOpen, t, token]
  );
}
