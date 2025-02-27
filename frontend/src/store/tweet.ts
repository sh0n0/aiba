import type { State } from "@/store/store.ts";
import type { StateCreator } from "zustand/vanilla";

export interface TimelineSlice {
  timeline: Tweet[];
  addTweet: (tweet: Tweet) => void;
  appendTweet: (tweet: Tweet) => void;
  attachReaction: (tweetId: number, reaction: IndividualReaction) => void;
  detachReaction: (tweetId: number, reaction: IndividualReaction) => void;
}

export type IndividualReaction = {
  emoji: string;
  account: {
    name: string;
    displayName: string;
  } | null;
};

export type Reaction = {
  emoji: string;
  count: number;
  hasReacted: boolean;
  accounts: {
    name: string;
    displayName: string;
  }[];
};

export type CompanionComment = {
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

export type Tweet = {
  id: number;
  text: string;
  companionComment: CompanionComment | null;
  account: {
    name: string;
    displayName: string;
    avatarUrl: string;
    createdAt: string;
  };
  reactions: Reaction[];
};

export const initialTimelineSlice = {
  timeline: [],
};

export const createTimelineSlice: StateCreator<State, [["zustand/devtools", never]], [], TimelineSlice> = (set) => ({
  ...initialTimelineSlice,
  addTweet: (tweet: Tweet) =>
    set((state) => {
      if (state.timeline.some((t) => t.id === tweet.id)) {
        return state;
      }
      return { timeline: [tweet, ...state.timeline] };
    }),
  appendTweet: (tweet: Tweet) =>
    set((state) => {
      if (state.timeline.some((t) => t.id === tweet.id)) {
        return state;
      }
      return { timeline: [...state.timeline, tweet] };
    }),
  attachReaction: (tweetId: number, reaction: IndividualReaction) =>
    set((state) => ({
      timeline: state.timeline.map((tweet) => {
        if (tweet.id !== tweetId) return tweet;

        const existingIndex = tweet.reactions.findIndex((r) => r.emoji === reaction.emoji);

        if (existingIndex === -1) {
          const newReaction = {
            emoji: reaction.emoji,
            count: 1,
            hasReacted: !reaction.account,
            accounts: reaction.account ? [reaction.account] : [],
          };
          return {
            ...tweet,
            reactions: [...tweet.reactions, newReaction],
          };
        }

        const existingReaction = tweet.reactions[existingIndex];
        const hasReacted =
          existingReaction.accounts.some((a) => a.name === reaction.account?.name) ||
          (!reaction.account && existingReaction.hasReacted);

        if (hasReacted) {
          return tweet;
        }

        return {
          ...tweet,
          reactions: tweet.reactions.map((r, index) => {
            if (index === existingIndex) {
              return {
                ...r,
                count: r.count + 1,
                hasReacted: r.hasReacted || !reaction.account,
                accounts: reaction.account ? [...r.accounts, reaction.account] : r.accounts,
              };
            }
            return r;
          }),
        };
      }),
    })),
  detachReaction: (tweetId: number, reaction: IndividualReaction) =>
    set((state) => ({
      timeline: state.timeline.map((tweet) => {
        if (tweet.id !== tweetId) return tweet;

        const updatedReactions = tweet.reactions
          .map((r) => {
            if (r.emoji !== reaction.emoji) return r;

            const accountExists =
              r.accounts.some((a) => a.name === reaction.account?.name) || (!reaction.account && r.hasReacted);
            if (!accountExists) return r;

            const newAccounts = reaction.account
              ? r.accounts.filter((a) => a.name !== reaction.account?.name)
              : r.accounts;
            const newCount = r.count - 1;

            if (newCount <= 0) {
              return null;
            }

            return {
              ...r,
              count: newCount,
              hasReacted: !reaction.account ? false : r.hasReacted,
              accounts: newAccounts,
            };
          })
          .filter((r) => r !== null) as Reaction[];

        return {
          ...tweet,
          reactions: updatedReactions,
        };
      }),
    })),
});
