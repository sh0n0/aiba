import type { AccountResponse, CompanionPageResponse, CompanionToolPageResponse, TweetResponse } from "@/api/types";
import { API_BASE } from "@/constants/api.ts";
import { convertToFormData } from "@/lib/utils";
import { useAppStore } from "@/store/store.ts";

export async function accountFetcher(_: string, { arg }: { arg: { name: string } }): Promise<AccountResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/account/${arg.name}`, {
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

export async function accountTweetsFetcher(url: string): Promise<TweetResponse[]> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

export async function accountCompanionsFetcher(
  _: string,
  { arg }: { arg: { name: string; page: number } },
): Promise<CompanionPageResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/account/${arg.name}/companions?page=${arg.page}`, {
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Fetch account companions failed");
  }
  return res.json();
}

export async function accountToolsFetcher(
  _: string,
  { arg }: { arg: { name: string; page: number } },
): Promise<CompanionToolPageResponse> {
  const res = await fetch(`${API_BASE}/account/${arg.name}/tools?page=${arg.page}`);
  if (!res.ok) {
    throw new Error("Fetch account tools failed");
  }
  return res.json();
}
