import { API_BASE } from "@/constants/api";
import { useAppStore } from "@/store/store";
import type { StreamsResponse } from "@/api/types";

export async function myStreamsFetcher(_: string): Promise<StreamsResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/streams/my`, {
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Fetch stream failed");
  }
  return res.json();
}
