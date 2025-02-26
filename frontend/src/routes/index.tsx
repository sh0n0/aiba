import { fetchOwnedCompanionsFetcher } from "@/api/companion";
import { postTweetFetcher, tweetsFetcher } from "@/api/tweet.ts";
import type { TweetResponse } from "@/api/types";
import { InfiniteScrollObserver } from "@/components/InfiniteScrollObserver";
import { TweetCard } from "@/components/TweetCard";
import { Button } from "@/components/ui/button.tsx";
import { FormField } from "@/components/ui/form.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea.tsx";
import { ACCOUNT_TWEET_PAGE_SIZE, API_BASE } from "@/constants/api";
import { useInfiniteLoading } from "@/hooks/useInfiniteLoading";
import { redirectToLoginIfUnauthorized } from "@/lib/utils.ts";
import { useAppStore } from "@/store/store.ts";
import type { Tweet } from "@/store/tweet.ts";
import { createCable } from "@anycable/web";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
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

  const form = useForm({ defaultValues: { text: "", companion: "" } });
  const { trigger, isMutating, error } = useSWRMutation("tweets", postTweetFetcher);
  const { data: ownedCompanions } = useSWR("owned_companions", fetchOwnedCompanionsFetcher);

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

  const onSubmitTweet = async (data: { text: string; companion: string }) => {
    const { text, companion: companionName } = data;
    const selectedCompanion = ownedCompanions?.find((c) => c.name === companionName) || null;
    const param = selectedCompanion
      ? { text, companion: { name: selectedCompanion.name, creator: { name: selectedCompanion.creator.name } } }
      : { text, companion: null };

    await trigger(param);
  };

  return (
    <div className="flex h-screen flex-col items-center overflow-y-auto pb-20">
      <form onSubmit={form.handleSubmit(onSubmitTweet)} className="my-12">
        <FormField
          control={form.control}
          name="text"
          render={({ field: { onChange } }) => <Textarea onChange={onChange} />}
        />
        <div className="mt-4 flex items-center justify-center">
          <Button type="submit" disabled={isMutating} className="w-20">
            {isMutating ? <LoaderCircle className="animate-spin" /> : "Tweet"}
          </Button>
          <span className="mx-2 text-gray-500">with companion:</span>

          <FormField
            control={form.control}
            name="companion"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select companion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {ownedCompanions?.map((companion) => (
                    <SelectItem key={companion.id} value={companion.name}>
                      {companion.creator.name} / {companion.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {error && <div className="mt-2 text-red-500">Error: {error.message}</div>}
      </form>
      {timeline.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
      {!isReachingEnd && <InfiniteScrollObserver onIntersect={loadMore}>Loading more...</InfiniteScrollObserver>}
    </div>
  );
}
