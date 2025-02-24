import type { TweetResponse } from "@/api/types";
import { API_BASE } from "@/constants/api.ts";
import { useAppStore } from "@/store/store.ts";

export async function tweetsFetcher(url: string): Promise<TweetResponse[]> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      uid,
      client,
      "access-token": accessToken,
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
