import type { State } from "@/store/store.ts";
import type { StateCreator } from "zustand/vanilla";

export interface TimelineSlice {
  timeline: TweetWithComment[];
  addTweet: (tweet: TweetWithComment) => void;
}

export type TweetWithComment = {
  tweet: {
    id: number;
    text: string;
    accountId: string;
    accountName: string;
  };
  companionComment: {
    id: number;
    text: string;
    companionId: number;
    companionName: string;
  };
};

export const initialTimelineSlice = {
  timeline: [],
};

export const createTimelineSlice: StateCreator<State, [["zustand/devtools", never]], [], TimelineSlice> = (set) => ({
  ...initialTimelineSlice,
  addTweet: (tweetWithComment) => set((state) => ({ timeline: [tweetWithComment, ...state.timeline] })),
});
