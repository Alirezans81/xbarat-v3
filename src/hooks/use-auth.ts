import { useAuthStore } from "@/lib/front/stores/auth";
import { useLoginSignupDialogStore } from "@/lib/front/stores/dialog";
import { defaultToken } from "@/types/globals";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function useResetApp() {
  const { setIsLoggedIn, setToken, setUser } = useAuthStore();

  return () => {
    setIsLoggedIn(false);
    setToken(defaultToken);
    setUser(null);
  };
}

export function useCheckTokenExpiration() {
  const { token } = useAuthStore();
  const resetApp = useResetApp();
  const { setOpen, setMode } = useLoginSignupDialogStore();
  const t = useTranslations("Other");

  return (onSuccess: () => void) => {
    const now = new Date();

    if (token && token.expiration && now < new Date(token.expiration)) {
      onSuccess();
    } else {
      resetApp();

      toast(t("mustLoginAgain"));
      setMode("login");
      setOpen(true);
    }
  };
}
