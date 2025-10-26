import { create } from "zustand";
import { User } from "@/generated/prisma";
import { persist } from "zustand/middleware";
import { Token } from "@/types/front/globals";

export type AuthStoreStates = {
  token: Token;
  user: User | null;
  isLoggedIn: boolean;
};
export type AuthStoreActions = {
  setToken: (value: Token) => void;
  setUser: (value: User | null) => void;
  setIsLoggedIn: (value: boolean) => void;
};
export const useAuthStore = create<AuthStoreStates & AuthStoreActions>()(
  persist(
    (set) => ({
      token: {
        value: "",
        expiration: "",
      },
      setToken(value) {
        set(() => ({
          token: value,
        }));
      },

      user: null,
      setUser(value) {
        set(() => ({
          user: value,
        }));
      },

      isLoggedIn: false,
      setIsLoggedIn(value) {
        set(() => ({
          isLoggedIn: value,
        }));
      },
    }),
    {
      name: "auth",
    }
  )
);
