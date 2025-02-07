import { postTweetFetcher } from "@/api/tweet.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { redirectToLoginIfUnauthorized } from "@/lib/utils.ts";
import { useAppStore } from "@/store/store.ts";
import type { TweetWithComment } from "@/store/tweet.ts";
import { createCable } from "@anycable/web";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: () => redirectToLoginIfUnauthorized(),
});

function Index() {
  const timeline = useAppStore((state) => state.timeline);
  const addTweet = useAppStore((state) => state.addTweet);
  const form = useForm({ defaultValues: { text: "" } });
  const { trigger, isMutating, error } = useSWRMutation("tweets", postTweetFetcher);

  useEffect(() => {
    const cable = createCable("ws://localhost:8080/cable", {
      logLevel: "debug",
    });
    const signedName = "InRpbWVsaW5lL3B1YmxpYyI=--e0700d7670d753a8d1c0a1948ccc102d7ac94fc26c9e0b84b434d64222e3ca6a";
    const publicChannel = cable.streamFromSigned(signedName);

    publicChannel.on("message", (message) => {
      console.log("Received message:", message);

      addTweet(message as TweetWithComment);
    });

    return () => {
      publicChannel.disconnect();
    };
  }, [addTweet]);

  const onSubmitTweet = async (data: { text: string }) => {
    const { text } = data;
    await trigger({ text });
  };

  return (
    <div className="flex h-screen flex-col items-center">
      <form onSubmit={form.handleSubmit(onSubmitTweet)}>
        <FormField
          control={form.control}
          name="text"
          render={({ field: { onChange } }) => <Textarea onChange={onChange} />}
        />
        <Button type="submit" disabled={isMutating}>
          {isMutating ? "Posting..." : "Submit"}
        </Button>
        {error && <div className="mt-2 text-red-500">Error: {error.message}</div>}
      </form>
      {timeline.map((tweetWithComment) => (
        <Card className="fade-in h-fit min-h-32 w-[600px]" key={tweetWithComment.tweet.id}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CardTitle>
                <Link to={"/$accountName"} params={{ accountName: `@${tweetWithComment.tweet.accountId}` }}>
                  {tweetWithComment.tweet.accountName}
                </Link>
              </CardTitle>
              <span className="text-gray-500">@{tweetWithComment.tweet.accountId}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p>{tweetWithComment.tweet.text}</p>
            <br />
            <p className="text-gray-500">{tweetWithComment.companionComment.companionName}</p>
            <p className="text-gray-500">{tweetWithComment.companionComment.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
