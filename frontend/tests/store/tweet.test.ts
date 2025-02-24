import { useAppStore } from "@/store/store";
import type { Tweet } from "@/store/tweet";
import { beforeEach, describe, expect, it } from "vitest";

describe("TimelineSlice", () => {
  beforeEach(() => {
    useAppStore.setState((state) => ({
      ...state,
      timeline: [],
    }));
  });

  const sampleTweet: Tweet = {
    id: 1,
    text: "Hello world",
    companionComment: {
      id: 1,
      text: "Sample tweet",
      companion: {
        name: "Companion1",
        description: "This is a companion tweet",
        publishedAt: "2025-01-01T00:00:00Z",
        creator: {
          name: "CreatorName",
          displayName: "CreatorDisplayName",
          createdAt: "2025-01-01T00:00:00Z",
        },
      },
    },
    account: {
      name: "AccountName",
      displayName: "Account Display Name",
      avatarUrl: "https://example.com/avatar.png",
      createdAt: "2025-01-01T00:00:00Z",
    },
    reactions: [],
  };

  describe("addTweet", () => {
    it("should add a tweet when using addTweet if the tweet is not present", () => {
      const store = useAppStore;

      store.getState().addTweet(sampleTweet);

      expect(store.getState().timeline).toHaveLength(1);
      expect(store.getState().timeline[0]).toEqual(sampleTweet);
    });

    it("should not add a duplicate tweet when using addTweet", () => {
      const store = useAppStore;

      store.getState().addTweet(sampleTweet);
      store.getState().addTweet(sampleTweet);

      expect(store.getState().timeline).toHaveLength(1);
    });

    it("should add tweets at the beginning with addTweet", () => {
      const store = useAppStore;
      const tweet1: Tweet = { ...sampleTweet, id: 1, text: "Tweet 1" };
      const tweet2: Tweet = { ...sampleTweet, id: 2, text: "Tweet 2" };

      store.getState().addTweet(tweet1);
      store.getState().addTweet(tweet2);

      expect(store.getState().timeline[0].id).toEqual(tweet2.id);
      expect(store.getState().timeline).toHaveLength(2);
    });
  });

  describe("appendTweet", () => {
    it("should append a tweet when using appendTweet if the tweet is not present", () => {
      const store = useAppStore;

      store.getState().appendTweet(sampleTweet);

      expect(store.getState().timeline).toHaveLength(1);
      expect(store.getState().timeline[0]).toEqual(sampleTweet);
    });

    it("should not append a duplicate tweet when using appendTweet", () => {
      const store = useAppStore;

      store.getState().appendTweet(sampleTweet);
      store.getState().appendTweet(sampleTweet);

      expect(store.getState().timeline).toHaveLength(1);
    });

    it("should append tweets at the end with appendTweet", () => {
      const store = useAppStore;
      const tweet1: Tweet = { ...sampleTweet, id: 1, text: "Tweet 1" };
      const tweet2: Tweet = { ...sampleTweet, id: 2, text: "Tweet 2" };

      store.getState().appendTweet(tweet1);
      store.getState().appendTweet(tweet2);

      const timeline = store.getState().timeline;
      expect(timeline[timeline.length - 1].id).toEqual(tweet2.id);
      expect(timeline).toHaveLength(2);
    });
  });

  describe("attachReaction", () => {
    it("should attach a reaction to a tweet", () => {
      const store = useAppStore;
      const tweet: Tweet = { ...sampleTweet, id: 1, text: "Tweet 1" };
      const reaction = {
        emoji: "👍",
        account: null,
      };

      store.getState().addTweet(tweet);
      store.getState().attachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet?.reactions).toHaveLength(1);
      expect(updatedTweet?.reactions[0].emoji).toEqual(reaction.emoji);
      expect(updatedTweet?.reactions[0].count).toEqual(1);
      expect(updatedTweet?.reactions[0].hasReacted).toEqual(true);
      expect(updatedTweet?.reactions[0].accounts).toHaveLength(0);
    });

    it("should attach a reaction to a tweet with an account", () => {
      const store = useAppStore;
      const tweet: Tweet = { ...sampleTweet, id: 1, text: "Tweet 1" };
      const reaction = {
        emoji: "👍",
        account: {
          name: "AccountName",
          displayName: "Account Display Name",
        },
      };

      store.getState().addTweet(tweet);
      store.getState().attachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet?.reactions[0].accounts[0]).toEqual(reaction.account);
    });

    it("should attach a reaction and icrement the count if the reaction already exists", () => {
      const store = useAppStore;
      const tweet: Tweet = {
        ...sampleTweet,
        id: 1,
        text: "Tweet 1",
        reactions: [
          {
            emoji: "👍",
            count: 1,
            hasReacted: false,
            accounts: [{ name: "AccountName", displayName: "Account Display Name" }],
          },
        ],
      };
      const reaction = {
        emoji: "👍",
        account: null,
      };

      store.getState().addTweet(tweet);
      store.getState().attachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet?.reactions[0].count).toEqual(2);
      expect(updatedTweet?.reactions[0].hasReacted).toEqual(true);
      expect(updatedTweet?.reactions[0].accounts[0]).toEqual(tweet.reactions[0].accounts[0]);
    });

    it("should attach a new reaction if the reaction already exists with a different emoji", () => {
      const store = useAppStore;
      const tweet: Tweet = {
        ...sampleTweet,
        id: 1,
        text: "Tweet 1",
        reactions: [
          {
            emoji: "👍",
            count: 1,
            hasReacted: false,
            accounts: [{ name: "AccountName", displayName: "Account Display Name" }],
          },
        ],
      };
      const reaction = {
        emoji: "👎",
        account: null,
      };

      store.getState().addTweet(tweet);
      store.getState().attachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet?.reactions).toHaveLength(2);
      expect(updatedTweet?.reactions[0]).toEqual(tweet.reactions[0]);
      expect(updatedTweet?.reactions[1].emoji).toEqual(reaction.emoji);
      expect(updatedTweet?.reactions[1].count).toEqual(1);
      expect(updatedTweet?.reactions[1].hasReacted).toEqual(true);
      expect(updatedTweet?.reactions[1].accounts).toHaveLength(0);
    });

    it("should ignore duplicate reactions by the emoji picker", () => {
      const store = useAppStore;
      const tweet: Tweet = {
        ...sampleTweet,
        id: 1,
        text: "Tweet 1",
        reactions: [{ emoji: "👍", count: 1, hasReacted: true, accounts: [] }],
      };
      const reaction = {
        emoji: "👍",
        account: null,
      };

      store.getState().addTweet(tweet);
      store.getState().attachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet).toEqual(tweet);
    });

    it("should ignore duplicate reactions by the same account", () => {
      const store = useAppStore;
      const account = {
        name: "AccountName",
        displayName: "Account Display Name",
      };
      const tweet: Tweet = {
        ...sampleTweet,
        id: 1,
        text: "Tweet 1",
        reactions: [{ emoji: "👍", count: 1, hasReacted: false, accounts: [account] }],
      };
      const reaction = {
        emoji: "👍",
        account: account,
      };

      store.getState().addTweet(tweet);
      store.getState().attachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet).toEqual(tweet);
    });
  });

  describe("detachReaction", () => {
    it("should detach a reaction from a tweet", () => {
      const store = useAppStore;
      const tweet: Tweet = {
        ...sampleTweet,
        id: 1,
        text: "Tweet 1",
        reactions: [
          {
            emoji: "👍",
            count: 2,
            hasReacted: true,
            accounts: [{ name: "AccountName", displayName: "Account Display Name" }],
          },
        ],
      };
      const reaction = {
        emoji: "👍",
        account: null,
      };

      store.getState().addTweet(tweet);
      store.getState().detachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet?.reactions[0].count).toEqual(1);
      expect(updatedTweet?.reactions[0].hasReacted).toEqual(false);
      expect(updatedTweet?.reactions[0].accounts).toHaveLength(1);
    });

    it("should detach a reaction from a tweet with an account", () => {
      const store = useAppStore;
      const account = {
        name: "AccountName",
        displayName: "Account Display Name",
      };
      const tweet: Tweet = {
        ...sampleTweet,
        id: 1,
        text: "Tweet 1",
        reactions: [{ emoji: "👍", count: 2, hasReacted: true, accounts: [account] }],
      };
      const reaction = {
        emoji: "👍",
        account: account,
      };

      store.getState().addTweet(tweet);
      store.getState().detachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet?.reactions[0].count).toEqual(1);
      expect(updatedTweet?.reactions[0].hasReacted).toEqual(true);
      expect(updatedTweet?.reactions[0].accounts).toHaveLength(0);
    });

    it("should detach a reaction and remove the reaction if the count is 1", () => {
      const store = useAppStore;
      const tweet: Tweet = {
        ...sampleTweet,
        id: 1,
        text: "Tweet 1",
        reactions: [{ emoji: "👍", count: 1, hasReacted: true, accounts: [] }],
      };
      const reaction = {
        emoji: "👍",
        account: null,
      };

      store.getState().addTweet(tweet);
      store.getState().detachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet?.reactions).toHaveLength(0);
    });

    it("should not detach a reaction if the account is not present", () => {
      const store = useAppStore;
      const account = {
        name: "AccountName",
        displayName: "Account Display Name",
      };
      const tweet: Tweet = {
        ...sampleTweet,
        id: 1,
        text: "Tweet 1",
        reactions: [{ emoji: "👍", count: 1, hasReacted: true, accounts: [account] }],
      };
      const reaction = {
        emoji: "👍",
        account: {
          name: "AnotherAccount",
          displayName: "Another Account Display Name",
        },
      };

      store.getState().addTweet(tweet);
      store.getState().detachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet).toEqual(tweet);
    });

    it("should not detach a reaction if the emoji is not present", () => {
      const store = useAppStore;
      const account = {
        name: "AccountName",
        displayName: "Account Display Name",
      };
      const tweet: Tweet = {
        ...sampleTweet,
        id: 1,
        text: "Tweet 1",
        reactions: [{ emoji: "👍", count: 1, hasReacted: true, accounts: [account] }],
      };
      const reaction = {
        emoji: "👎",
        account: account,
      };

      store.getState().addTweet(tweet);
      store.getState().detachReaction(tweet.id, reaction);

      const updatedTweet = store.getState().timeline.find((t) => t.id === tweet.id);
      expect(updatedTweet).toEqual(tweet);
    });
  });
});
