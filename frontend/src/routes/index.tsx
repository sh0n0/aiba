import { postTweetFetcher } from "@/api/tweet.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useAppStore } from "@/store/store.ts";
import type { Tweet } from "@/store/tweet.ts";
import { createCable } from "@anycable/web";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: () => {
    const accessToken = useAppStore.getState().accessToken;
    if (!accessToken) {
      throw redirect({
        to: "/login",
      });
    }
  },
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
      {timeline.map((tweet) => (
        <Card className="fade-in h-fit min-h-32 w-[600px]" key={tweet.id}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CardTitle>{tweet.accountName}</CardTitle>
              <span className="text-gray-500">@{tweet.accountId}</span>
            </div>
          </CardHeader>
          <CardContent>{tweet.text}</CardContent>
        </Card>
      ))}
    </div>
  );
}
