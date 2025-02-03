import type { State } from "@/store/store.ts";
import type { StateCreator } from "zustand/vanilla";

export interface TimelineSlice {
  timeline: Tweet[];
  addTweet: (tweet: Tweet) => void;
}

type Tweet = {
  id: number;
  text: string;
  accountId: string;
  accountName: string;
};

export const initialTimelineSlice = {
  timeline: [],
};

export const createTimelineSlice: StateCreator<State, [["zustand/devtools", never]], [], TimelineSlice> = (set) => ({
  ...initialTimelineSlice,
  addTweet: (tweet) => set((state) => ({ timeline: [tweet, ...state.timeline] })),
});
