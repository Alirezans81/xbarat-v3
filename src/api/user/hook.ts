import { User } from "@/generated/prisma";
import { createUser } from "./api";
import { FetchProps } from "@/types/globals";
import { useAuthStore } from "@/lib/store";

type CreateUserProps = {
  user: User;
};
export const useCreateUser = () => {
  const { token, setUser, setIsLoggedIn } = useAuthStore((state) => state);

  const fetch = async ({
    user,
    onError,
    onSuccess,
    onFinally,
  }: CreateUserProps & FetchProps) => {
    await createUser(token.access, user)
      .then((res) => {
        setUser(res.data);
        setIsLoggedIn(true);
        onSuccess?.(res.data);
      })
      .catch((err) => {
        process.env.APP_MODE === "development" && console.error(err);
        onError?.(err);
      })
      .finally(() => {
        onFinally?.();
      });
  };

  return fetch;
};
