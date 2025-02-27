import type { CompanionComment, IndividualReaction, Reaction, Tweet } from "@/store/tweet";

type Message = TweetMessage | ReactionMessage;

type TweetMessage = {
  type: "tweet";
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

type ReactionMessage = {
  type: "reaction";
  action: "attach" | "detach";
  tweetId: number;
  emoji: string;
  account: {
    name: string;
    displayName: string;
  };
};

export class TimelineMessageDispatcher {
  private currentUserName: string | undefined;
  private addTweet: (tweet: Tweet) => void;
  private attachReaction: (tweetId: number, reaction: IndividualReaction) => void;
  private detachReaction: (tweetId: number, reaction: IndividualReaction) => void;

  constructor(
    currentUserName: string | undefined,
    addTweet: (tweet: Tweet) => void,
    attachReaction: (tweetId: number, reaction: IndividualReaction) => void,
    detachReaction: (tweetId: number, reaction: IndividualReaction) => void,
  ) {
    this.currentUserName = currentUserName;
    this.addTweet = addTweet;
    this.attachReaction = attachReaction;
    this.detachReaction = detachReaction;
  }

  dispatch(receivedMessage: unknown): void {
    const message = receivedMessage as Message;

    switch (message.type) {
      case "tweet":
        this.dispatchTweetMessage(message);
        break;
      case "reaction":
        this.dispatchReactionMessage(message);
        break;
    }
  }

  private dispatchTweetMessage(message: TweetMessage): void {
    this.addTweet(message);
  }

  private dispatchReactionMessage(message: ReactionMessage): void {
    const { action, tweetId, emoji, account } = message;

    if (this.currentUserName && this.currentUserName === account.name) {
      return;
    }

    if (action === "attach") {
      this.attachReaction(tweetId, { emoji, account });
    } else {
      this.detachReaction(tweetId, { emoji, account });
    }
  }
}
