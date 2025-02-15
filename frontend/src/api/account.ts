import { API_BASE } from "@/constants/api.ts";
import { convertToFormData } from "@/lib/utils";
import { useAppStore } from "@/store/store.ts";

type AccountResponse = {
  name: string;
  displayName: string;
  avatarUrl: string;
};

export async function accountFetcher(_: string, { arg }: { arg: { name: string } }): Promise<AccountResponse> {
  const res = await fetch(`${API_BASE}/account/${arg.name}`);
  if (!res.ok) {
    throw new Error("Fetch account failed");
  }
  return res.json();
}

export async function myAccountFetcher(_: string): Promise<AccountResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/account/my`, {
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Fetch account failed");
  }
  return res.json();
}

export async function postAvatarFetcher(_: string, { arg }: { arg: { base64Image: string } }) {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/account/avatar`, {
    method: "POST",
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
    body: convertToFormData(arg.base64Image, "avatar", "avatar.png"),
  });
  if (!res.ok) {
    throw new Error("Post avatar failed");
  }
  return true;
}

export type TweetResponse = {
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
    avatarUrl: string;
  };
};

export const ACCOUNT_TWEET_PAGE_SIZE = 10;

export async function accountTweetsFetcher(url: string): Promise<TweetResponse[]> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}
