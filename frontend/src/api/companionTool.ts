import type { CompanionToolResponse } from "@/api/types/companionTool";
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
    throw new Error("Fetch owned companions failed");
  }
  return res.json();
}
