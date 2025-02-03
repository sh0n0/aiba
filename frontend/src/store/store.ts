import { type UserSlice, createUserSlice, initialUserSlice } from "@/store/user";
import { devtools } from "zustand/middleware";
import { create } from "zustand/react";
import { type TimelineSlice, createTimelineSlice, initialTimelineSlice } from "./tweet";

export type State = UserSlice &
  TimelineSlice & {
    clearAll: () => void;
  };

export const useAppStore = create<State>()(
  devtools((...args) => {
    return {
      ...createUserSlice(...args),
      ...createTimelineSlice(...args),
      clearAll: () => {
        const set = args[0];
        set(() => ({
          ...initialUserSlice,
          ...initialTimelineSlice,
        }));
        localStorage.clear();
      },
    };
  }),
);
