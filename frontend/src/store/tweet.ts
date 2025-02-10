import type { State } from "@/store/store.ts";
import type { StateCreator } from "zustand/vanilla";

export interface TimelineSlice {
  timeline: Tweet[];
  addTweet: (tweet: Tweet) => void;
}

export type Tweet = {
  id: number;
  text: string;
  companionComment: {
    id: number;
    text: string;
    companion: {
      name: string;
      description: string;
      publishedAt: string | null;
      creator: {
        name: string;
        displayName: string;
        createdAt: string;
      };
    };
  };
  account: {
    name: string;
    displayName: string;
    createdAt: string;
  };
};

export const initialTimelineSlice = {
  timeline: [],
};

export const createTimelineSlice: StateCreator<State, [["zustand/devtools", never]], [], TimelineSlice> = (set) => ({
  ...initialTimelineSlice,
  addTweet: (tweetWithComment) => set((state) => ({ timeline: [tweetWithComment, ...state.timeline] })),
});
