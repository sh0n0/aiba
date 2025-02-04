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
