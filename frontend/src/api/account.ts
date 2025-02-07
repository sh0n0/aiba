import { API_BASE } from "@/constants/api.ts";
import { useAppStore } from "@/store/store.ts";

type AccountResponse = {
  name: string;
  displayName: string;
};

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
