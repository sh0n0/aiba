import { API_BASE } from "@/constants/api";
import { useAppStore } from "@/store/store";

export async function createReactionFetcher(_: string, { arg }: { arg: { tweetId: number; emoji: string } }) {
  console.log("createReactionFetcher");
  const { uid, client, accessToken } = useAppStore.getState().getAuth();
  const res = await fetch(`${API_BASE}/tweets/${arg.tweetId}/reactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      uid,
      client,
      "access-token": accessToken,
    },
    body: JSON.stringify({ reaction: { emoji: arg.emoji } }),
  });
  if (!res.ok) {
    throw new Error("Create reaction failed");
  }
  return true;
}

export async function deleteReactionFetcher(_: string, { arg }: { arg: { tweetId: number; emoji: string } }) {
  console.log("deleteReactionFetcher");
  const { uid, client, accessToken } = useAppStore.getState().getAuth();
  const res = await fetch(`${API_BASE}/tweets/${arg.tweetId}/reactions`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      uid,
      client,
      "access-token": accessToken,
    },
    body: JSON.stringify({ reaction: { emoji: arg.emoji } }),
  });
  if (!res.ok) {
    throw new Error("Delete reaction failed");
  }
  return true;
}
