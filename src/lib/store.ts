import { create } from "zustand";
import { defaultToken, Token } from "../types/globals";
import { User } from "@/generated/prisma";

export type DialogStoreStates = {
  open: boolean;
  mode: "login" | "signup";
};
export type DialogStoreActions = {
  setOpen: (value: boolean) => void;
  setMode: (value: "login" | "signup") => void;
};

export const useLoginSignupDialogStore = create<
  DialogStoreStates & DialogStoreActions
>((set) => ({
  open: false,
  setOpen(value) {
    set(() => ({
      open: value,
    }));
  },
  mode: "login",
  setMode(value) {
    set(() => ({
      mode: value,
    }));
  },
}));

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
export const useAuthStore = create<AuthStoreStates & AuthStoreActions>(
  (set) => ({
    token: defaultToken,
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
  })
);
