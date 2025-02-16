import { API_BASE } from "@/constants/api.ts";
import { useAppStore } from "@/store/store.ts";
import type { TweetResponse } from "./types";

export async function tweetsFetcher(url: string): Promise<TweetResponse[]> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export async function postTweetFetcher(_: string, { arg }: { arg: { text: string } }) {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/tweets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      uid,
      client,
      "access-token": accessToken,
    },
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    throw new Error("Post tweet failed");
  }
  return true;
}
