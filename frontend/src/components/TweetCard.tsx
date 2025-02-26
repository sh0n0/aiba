import { createReactionFetcher, deleteReactionFetcher } from "@/api/reaction";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppStore } from "@/store/store";
import data from "@emoji-mart/data/sets/15/twitter.json";
import Picker from "@emoji-mart/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "@tanstack/react-router";
import { SmilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import { EmojiReactions } from "./EmojiReactions";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

type TweetCardProps = {
  id: number;
  text: string;
  companionComment: CompanionComment | null;
  account: {
    name: string;
    displayName: string;
    avatarUrl: string;
  };
  reactions: {
    emoji: string;
    count: number;
    hasReacted: boolean;
    accounts: {
      name: string;
      displayName: string;
    }[];
  }[];
};

type CompanionComment = {
  text: string;
  companion: {
    name: string;
    creator: {
      name: string;
    };
  };
};

export const TweetCard = ({ tweet }: { tweet: TweetCardProps }) => {
  const attachReaction = useAppStore((state) => state.attachReaction);
  const detachReaction = useAppStore((state) => state.detachReaction);

  const { trigger: createTrigger } = useSWRMutation("tweets/reactions", createReactionFetcher);
  const { trigger: deleteTrigger } = useSWRMutation("tweets/reactions", deleteReactionFetcher);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredOnCard, setHoveredOnCard] = useState(false);
  const [hoveredOnMenu, setHoveredOnMenu] = useState(false);

  const handleEmojiSelect = async (emoji: { native: string }) => {
    console.log("Selected emoji:", emoji.native);
    attachReaction(tweet.id, { emoji: emoji.native, account: null });
    await createTrigger({ tweetId: tweet.id, emoji: emoji.native });
    setShowEmojiPicker(false);
  };

  const handleClickOutside = () => {
    if (showEmojiPicker && !hoveredOnMenu) {
      setShowEmojiPicker(false);
    }
  };

  const handleMenuEmoji = () => {
    setShowEmojiPicker(true);
  };

  const handleToggleReaction = async (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      detachReaction(tweet.id, { emoji, account: null });
      await deleteTrigger({ tweetId: tweet.id, emoji });
    } else {
      attachReaction(tweet.id, { emoji, account: null });
      await createTrigger({ tweetId: tweet.id, emoji });
    }
  };

  useEffect(() => {
    setMenuOpen(hoveredOnCard || showEmojiPicker);
  }, [showEmojiPicker, hoveredOnCard]);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setHoveredOnCard(true);
      }}
      onMouseLeave={() => {
        setHoveredOnCard(false);
      }}
    >
      <Popover open={menuOpen}>
        <PopoverTrigger asChild>
          <div>
            <Card className="fade-in mb-4 w-[600px] overflow-visible" key={tweet.id}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage
                      src={tweet.account.avatarUrl || undefined}
                      alt="avatar"
                      className="h-10 w-10 rounded-full"
                    />
                    <AvatarFallback />
                  </Avatar>
                  <CardTitle>
                    <Link to={"/$accountName"} params={{ accountName: `@${tweet.account.name}` }}>
                      {tweet.account.displayName}
                    </Link>
                  </CardTitle>
                  <span className="text-gray-500">@{tweet.account.name}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p>{tweet.text}</p>
                {tweet.companionComment && <CompanionCommentComponent companionComment={tweet.companionComment} />}
                {tweet.reactions.length > 0 && (
                  <div className="mt-8">
                    <EmojiReactions reactions={tweet.reactions} onToggleReaction={handleToggleReaction} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="absolute top-8 right-8 z-10 h-fit w-fit rounded bg-white shadow"
          onMouseEnter={() => {
            setHoveredOnMenu(true);
          }}
          onMouseLeave={() => {
            setHoveredOnMenu(false);
          }}
        >
          {!showEmojiPicker && (
            <div className="flex flex-col">
              <button type="button" onClick={handleMenuEmoji} className="rounded p-2 hover:bg-gray-100">
                <SmilePlus width={20} height={20} />
              </button>
            </div>
          )}
          {showEmojiPicker && (
            <div className="flex flex-col">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} onClickOutside={handleClickOutside} set="twitter" />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

const CompanionCommentComponent = ({ companionComment }: { companionComment: CompanionComment }) => {
  return (
    <div>
      <Separator className="mt-8 mb-4" />
      <Link
        to="/$accountName/$companionName"
        params={{
          accountName: `@${companionComment.companion.creator.name}`,
          companionName: companionComment.companion.name,
        }}
      >
        {companionComment.companion.name}
      </Link>
      <p className="mt-4">{companionComment.text}</p>
    </div>
  );
};
