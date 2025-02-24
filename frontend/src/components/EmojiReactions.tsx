import twemoji from "@discordapp/twemoji";

type EmojiReaction = {
  emoji: string;
  count: number;
  hasReacted: boolean;
  accounts: {
    name: string;
    displayName: string;
  }[];
};

type EmojiReactionsProps = {
  reactions: EmojiReaction[];
  onToggleReaction: (emoji: string, hasReacted: boolean) => void;
};

export const EmojiReactions = ({ reactions, onToggleReaction }: EmojiReactionsProps) => {
  return (
    <div className="flex gap-2">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          onClick={() => onToggleReaction(reaction.emoji, reaction.hasReacted)}
          className={`flex items-center gap-1 rounded p-2 text-sm ${reaction.hasReacted ? "bg-blue-100 text-blue-800" : "bg-gray-100 hover:bg-gray-200"}`}
          title={reaction.accounts.map((acc) => acc.displayName).join(", ")}
        >
          <img src={extractEmojiSrc(reaction.emoji)} alt={reaction.emoji} className="h-5 w-5" />
          <span>{reaction.count}</span>
        </button>
      ))}
    </div>
  );
};

function extractEmojiSrc(emoji: string) {
  const emojiUrl = twemoji.parse(emoji).match(/src="([^"]+)"/)?.[1];
  return emojiUrl;
}
