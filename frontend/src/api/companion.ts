import type { CompanionDetailResponse, CompanionResponse } from "@/api/types";
import { API_BASE } from "@/constants/api.ts";
import { toSnakeCase } from "@/lib/utils";
import { useAppStore } from "@/store/store.ts";

type Tool = {
  creatorName: string;
  toolName: string;
};

export async function createCompanionFetcher(
  _: string,
  { arg }: { arg: { name: string; description: string; prompt: string; tools: Tool[] } },
) {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/companions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      uid,
      client,
      "access-token": accessToken,
    },
    body: JSON.stringify(toSnakeCase({ companion: arg })),
  });
  if (!res.ok) {
    throw new Error("Create companion failed");
  }
  return true;
}

export async function fetchOpenCompanionsFetcher(_: string): Promise<CompanionResponse[]> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/companions`, {
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Fetch open companions failed");
  }
  return res.json();
}

export async function fetchOwnedCompanionsFetcher(_: string): Promise<CompanionResponse[]> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/companions/owned`, {
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Fetch owned companions failed");
  }
  return res.json();
}

export async function fetchCompanionDetailFetcher(
  _: string,
  { arg }: { arg: { accountName: string; companionName: string } },
): Promise<CompanionDetailResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/companions/${arg.accountName}/${arg.companionName}`, {
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Fetch companion failed");
  }
  return res.json();
}

export async function publishCompanionFetcher(
  _: string,
  { arg }: { arg: { accountName: string; companionName: string } },
): Promise<CompanionDetailResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/companions/${arg.accountName}/${arg.companionName}/publish`, {
    method: "POST",
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Publish companion failed");
  }
  return res.json();
}

export async function unpublishCompanionFetcher(
  _: string,
  { arg }: { arg: { accountName: string; companionName: string } },
): Promise<CompanionDetailResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/companions/${arg.accountName}/${arg.companionName}/unpublish`, {
    method: "POST",
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Unpublish companion failed");
  }
  return res.json();
}
