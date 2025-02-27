import { TimelineMessageDispatcher } from "@/lib/TimelineMessageDispatcher";
import type { IndividualReaction, Tweet } from "@/store/tweet";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("TimelineMessageDispatcher", () => {
  let dispatcher: TimelineMessageDispatcher;
  let mockAddTweet: (tweet: Tweet) => void;
  let mockAttachReaction: (tweetId: number, reaction: IndividualReaction) => void;
  let mockDetachReaction: (tweetId: number, reaction: IndividualReaction) => void;
  const currentUserName = "testUser";

  beforeEach(() => {
    mockAddTweet = vi.fn();
    mockAttachReaction = vi.fn();
    mockDetachReaction = vi.fn();

    dispatcher = new TimelineMessageDispatcher(currentUserName, mockAddTweet, mockAttachReaction, mockDetachReaction);
  });

  describe("dispatch", () => {
    it("should call addTweet for tweet message", () => {
      const tweetMessage = {
        type: "tweet",
        id: 1,
        text: "Hello, world!",
        companionComment: null,
        account: {
          name: "otherUser",
          displayName: "Other User",
          avatarUrl: "https://example.com/avatar.png",
          createdAt: "2023-01-01",
        },
        reactions: [],
      };

      dispatcher.dispatch(tweetMessage);

      expect(mockAddTweet).toHaveBeenCalledTimes(1);
      expect(mockAddTweet).toHaveBeenCalledWith(tweetMessage);
    });

    it("should call attachReaction for attach reaction message", () => {
      const reactionMessage = {
        type: "reaction",
        action: "attach",
        tweetId: 1,
        emoji: "👍",
        account: {
          name: "otherUser",
          displayName: "Other User",
        },
      };

      dispatcher.dispatch(reactionMessage);

      expect(mockAttachReaction).toHaveBeenCalledTimes(1);
      expect(mockAttachReaction).toHaveBeenCalledWith(1, {
        emoji: "👍",
        account: {
          name: "otherUser",
          displayName: "Other User",
        },
      });
    });

    it("should call detachReaction for detach reaction message", () => {
      const reactionMessage = {
        type: "reaction",
        action: "detach",
        tweetId: 1,
        emoji: "👍",
        account: {
          name: "otherUser",
          displayName: "Other User",
        },
      };

      dispatcher.dispatch(reactionMessage);

      expect(mockDetachReaction).toHaveBeenCalledTimes(1);
      expect(mockDetachReaction).toHaveBeenCalledWith(1, {
        emoji: "👍",
        account: {
          name: "otherUser",
          displayName: "Other User",
        },
      });
    });

    it("should ignore reaction messages from current user", () => {
      const reactionMessage = {
        type: "reaction",
        action: "attach",
        tweetId: 1,
        emoji: "👍",
        account: {
          name: currentUserName,
          displayName: "Test User",
        },
      };

      dispatcher.dispatch(reactionMessage);

      expect(mockAttachReaction).not.toHaveBeenCalled();
      expect(mockDetachReaction).not.toHaveBeenCalled();
    });
  });
});
