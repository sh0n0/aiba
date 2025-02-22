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
});
