import type { State } from "@/store/store.ts";
import { persist } from "zustand/middleware";
import type { StateCreator } from "zustand/vanilla";

export interface UserSlice {
  uid: string | null;
  client: string | null;
  accessToken: string | null;
  setAuth: (uid: string, client: string, accessToken: string) => void;
  getAuth: () => { uid: string; client: string; accessToken: string };
}

export const initialUserSlice = {
  uid: null,
  client: null,
  accessToken: null,
};

export const createUserSlice: StateCreator<
  State,
  [["zustand/devtools", never]],
  [["zustand/persist", UserSlice]],
  UserSlice
> = persist(
  (set, get) => ({
    ...initialUserSlice,
    setAuth: (uid, client, accessToken) => set({ uid, client, accessToken }),
    getAuth: () => ({
      uid: get().uid ?? "",
      client: get().client ?? "",
      accessToken: get().accessToken ?? "",
    }),
  }),
  {
    name: "user",
  },
);
