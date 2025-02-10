import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

type Tweet = {
  id: number;
  text: string;
  companionComment: {
    text: string;
    companion: {
      name: string;
      creator: {
        name: string;
      };
    };
  };
  account: {
    name: string;
    displayName: string;
  };
};

export const TweetCard = ({ tweet }: { tweet: Tweet }) => {
  return (
    <Card className="fade-in h-fit min-h-32 w-[600px]" key={tweet.id}>
      <CardHeader>
        <div className="flex items-center space-x-2">
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
        <Separator className="mt-8 mb-4" />
        <Link
          to={"/$accountName/$companionName"}
          params={{
            accountName: `@${tweet.companionComment.companion.creator.name}`,
            companionName: tweet.companionComment.companion.name,
          }}
        >
          {tweet.companionComment.companion.name}
        </Link>
        <p className="mt-4">{tweet.companionComment.text}</p>
      </CardContent>
    </Card>
  );
};
