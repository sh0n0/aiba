import type { NotificationPageResponse } from "@/api/types";
import { API_BASE } from "@/constants/api";
import { useAppStore } from "@/store/store";

export async function fetchNotificationsFetcher(
  _: string,
  { arg }: { arg: { page: number } },
): Promise<NotificationPageResponse> {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/notifications?page=${arg.page}`, {
    headers: {
      "Content-Type": "application/json",
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Fetch notifications failed");
  }
  return res.json();
}
