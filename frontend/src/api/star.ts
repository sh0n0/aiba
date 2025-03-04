import { API_BASE } from "@/constants/api";
import { useAppStore } from "@/store/store";

export async function starCompanionFetcher(
  _: string,
  { arg }: { arg: { accountName: string; companionName: string } },
) {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/companions/${arg.accountName}/${arg.companionName}/star`, {
    method: "POST",
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Star companion failed");
  }
  return;
}

export async function unstarCompanionFetcher(
  _: string,
  { arg }: { arg: { accountName: string; companionName: string } },
) {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/companions/${arg.accountName}/${arg.companionName}/star`, {
    method: "DELETE",
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Unstar companion failed");
  }
  return;
}

export async function starCompanionToolFetcher(_: string, { arg }: { arg: { accountName: string; toolName: string } }) {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/tools/${arg.accountName}/${arg.toolName}/star`, {
    method: "POST",
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Star companion tool failed");
  }
  return;
}

export async function unstarCompanionToolFetcher(
  _: string,
  { arg }: { arg: { accountName: string; toolName: string } },
) {
  const { uid, client, accessToken } = useAppStore.getState().getAuth();

  const res = await fetch(`${API_BASE}/tools/${arg.accountName}/${arg.toolName}/star`, {
    method: "DELETE",
    headers: {
      uid,
      client,
      "access-token": accessToken,
    },
  });
  if (!res.ok) {
    throw new Error("Unstar companion tool failed");
  }
  return;
}
