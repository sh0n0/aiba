import type { CompanionToolDetailResponse, CompanionToolResponse } from "@/api/types";
import { API_BASE } from "@/constants/api";
import { toSnakeCase } from "@/lib/utils";
import { useAppStore } from "@/store/store";

type ParamType = "string" | "number" | "array" | "boolean";

export async function createCompanionToolFetcher(
  _: string,
  {
    arg,
  }: {
    arg: {
      name: string;
      description: string;
      url: string;
      params: { paramType: ParamType; name: string; description: string }[];
    };
  },
) {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/tools`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      uid,
      client,
      "access-token": accessToken,
    },
    body: JSON.stringify(toSnakeCase({ companionTool: arg })),
  });
  if (!res.ok) {
    throw new Error("Create companion tool failed");
  }
  return true;
}

export async function fetchOwnedCompanionToolsFetcher(_: string): Promise<CompanionToolResponse[]> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/tools/owned`, {
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Fetch owned companion tools failed");
  }
  return res.json();
}

export async function fetchCompanionToolDetailFetcher(
  _: string,
  { arg }: { arg: { accountName: string; toolName: string } },
): Promise<CompanionToolDetailResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/tools/${arg.accountName}/${arg.toolName}`, {
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Fetch companion tool failed");
  }
  return res.json();
}

export async function publishCompanionToolFetcher(
  _: string,
  { arg }: { arg: { accountName: string; toolName: string } },
): Promise<CompanionToolDetailResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/tools/${arg.accountName}/${arg.toolName}/publish`, {
    method: "POST",
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Publish companion tool failed");
  }
  return res.json();
}

export async function unpublishCompanionToolFetcher(
  _: string,
  { arg }: { arg: { accountName: string; toolName: string } },
): Promise<CompanionToolDetailResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/tools/${arg.accountName}/${arg.toolName}/unpublish`, {
    method: "POST",
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Unpublish companion tool failed");
  }
  return res.json();
}
