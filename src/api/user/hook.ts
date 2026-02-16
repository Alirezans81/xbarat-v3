import { createUser, loginUser } from "./api";
import { FetchProps, Token } from "@/types/front/globals";
import { CreateUser, LoginUser } from "@/types/front/user";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useAuthStore } from "@/lib/front/stores/auth";
import { useCheckTokenExpiration } from "@/hooks/use-auth";
import { GetUser } from "@/types/front/user";
import { getUser } from "./api";
type CreateUserProps = {
  user: CreateUser;
};
type GetUserProps = {
  setUser: (value: GetUser) => void;
};
export const useGetUser = () => {
  const t = useTranslations("ApiErrors");

  const checkTokenExpiration = useCheckTokenExpiration();
  const { token } = useAuthStore();

  const fetch = useCallback(
    ({
      setUser,
      onError,
      onSuccess,
      onFinally,
    }: GetUserProps & FetchProps) => {
      checkTokenExpiration(async () => {
        await getUser(token)
          .then((res) => {
            setUser(res);
            onSuccess?.(res);
          })
          .catch((err) => {
            if (process.env.NEXT_PUBLIC_APP_MODE === "development") {
              console.error(err.response);
            }
            toast.error(t(err.response.data.error.message));
            onError?.(err);
          })
          .finally(() => {
            onFinally?.();
          });
      });
    },
    [checkTokenExpiration, t, token]
  );

  return fetch;
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
      .then((data) => {
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
        if (process.env.NEXT_PUBLIC_APP_MODE === "development") {
          console.error(err.response);
        }
        toast.error(t(err.response.data.error.message));
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
      .then((data) => {
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
        if (process.env.NEXT_PUBLIC_APP_MODE === "development") {
          console.error(err.response);
        }
        toast.error(t(err.response.data.error.message));
        onError?.(err);
      })
      .finally(() => {
        onFinally?.();
      });
  };

  return fetch;
};
