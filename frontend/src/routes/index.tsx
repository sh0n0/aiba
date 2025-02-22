import { postTweetFetcher, tweetsFetcher } from "@/api/tweet.ts";
import type { TweetResponse } from "@/api/types";
import { InfiniteScrollObserver } from "@/components/InfiniteScrollObserver";
import { TweetCard } from "@/components/TweetCard";
import { Button } from "@/components/ui/button.tsx";
import { FormField } from "@/components/ui/form.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { ACCOUNT_TWEET_PAGE_SIZE, API_BASE } from "@/constants/api";
import { useInfiniteLoading } from "@/hooks/useInfiniteLoading";
import { redirectToLoginIfUnauthorized } from "@/lib/utils.ts";
import { useAppStore } from "@/store/store.ts";
import type { Tweet } from "@/store/tweet.ts";
import { createCable } from "@anycable/web";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWRInfinite from "swr/infinite";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: () => redirectToLoginIfUnauthorized(),
});

function Index() {
  const timeline = useAppStore((state) => state.timeline);
  const addTweet = useAppStore((state) => state.addTweet);
  const appendTweet = useAppStore((state) => state.appendTweet);

  const form = useForm({ defaultValues: { text: "" } });
  const { trigger, isMutating, error } = useSWRMutation("tweets", postTweetFetcher);

  const { data: tweets, setSize } = useSWRInfinite((pageIndex: number, previousPageData: TweetResponse[]) => {
    if (previousPageData && previousPageData.length < ACCOUNT_TWEET_PAGE_SIZE) return null;
    return `${API_BASE}/tweets?page=${pageIndex + 1}`;
  }, tweetsFetcher);

  const { isReachingEnd, loadMore } = useInfiniteLoading(tweets, setSize, ACCOUNT_TWEET_PAGE_SIZE);

  useEffect(() => {
    if (tweets && tweets.length > 0) {
      const lastPage = tweets[tweets.length - 1] || [];
      for (const tweet of lastPage) {
        appendTweet(tweet);
      }
    }
  }, [tweets, appendTweet]);

  useEffect(() => {
    const cable = createCable("ws://localhost:8080/cable", {
      logLevel: "debug",
    });
    const signedName = "InRpbWVsaW5lL3B1YmxpYyI=--e0700d7670d753a8d1c0a1948ccc102d7ac94fc26c9e0b84b434d64222e3ca6a";
    const publicChannel = cable.streamFromSigned(signedName);

    publicChannel.on("message", (message) => {
      console.log("Received message:", message);

      addTweet(message as Tweet);
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
    <div className="flex h-screen flex-col items-center overflow-y-auto pb-20">
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
      {timeline.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
      {!isReachingEnd && <InfiniteScrollObserver onIntersect={loadMore}>Loading more...</InfiniteScrollObserver>}
    </div>
  );
}
