import { create } from "zustand";

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
