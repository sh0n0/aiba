import { API_BASE } from "@/constants/api.ts";
import { useAppStore } from "@/store/store.ts";

export async function createCompanionFetcher(
  _: string,
  { arg }: { arg: { name: string; description: string; prompt: string } },
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
    body: JSON.stringify(arg),
  });
  if (!res.ok) {
    throw new Error("Create companion failed");
  }
  return true;
}

type OpenCompanionResponse = {
  id: number;
  name: string;
  description: string;
};

export async function fetchOpenCompanionsFetcher(_: string): Promise<OpenCompanionResponse[]> {
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

export async function fetchOwnedCompanionsFetcher(_: string): Promise<OpenCompanionResponse[]> {
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
