import { createUser, loginUser } from "./api";
import { FetchProps, Token } from "@/types/front/globals";
import { CreateUser, LoginUser } from "@/types/front/user";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/front/stores/auth";

type CreateUserProps = {
  user: CreateUser;
};
export const useCreateUser = () => {
  const t = useTranslations("ApiErrors");

  const { setToken, setIsLoggedIn, setUser } = useAuthStore();

  const fetch = async ({
    user,
    onError,
    onSuccess,
    onFinally,
  }: CreateUserProps & FetchProps) => {
    await createUser(user)
      .then((res) => {
        const { data } = res;

        const token: Token = {
          value: data.token,
          expiration: data.token_exp,
        };
        setToken(token);

        setUser(data.user);

        setIsLoggedIn(true);
        onSuccess?.(data);
      })
      .catch((err) => {
        process.env.NEXT_PUBLIC_APP_MODE === "development" &&
          console.error(err.response);
        toast(t(err.response.data.error.message));
        onError?.(err);
      })
      .finally(() => {
        onFinally?.();
      });
  };

  return fetch;
};

type LoginUserProps = {
  user: LoginUser;
};
export const useLoginUser = () => {
  const t = useTranslations("ApiErrors");

  const { setToken, setIsLoggedIn, setUser } = useAuthStore();

  const fetch = async ({
    user,
    onError,
    onSuccess,
    onFinally,
  }: LoginUserProps & FetchProps) => {
    await loginUser(user)
      .then((res) => {
        const { data } = res;

        const token: Token = {
          value: data.token,
          expiration: data.token_exp,
        };
        setToken(token);

        setUser(data.user);

        setIsLoggedIn(true);
        onSuccess?.(data);
      })
      .catch((err) => {
        process.env.NEXT_PUBLIC_APP_MODE === "development" &&
          console.error(err.response);
        toast(t(err.response.data.error.message));
        onError?.(err);
      })
      .finally(() => {
        onFinally?.();
      });
  };

  return fetch;
};
