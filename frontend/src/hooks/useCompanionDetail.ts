import { fetchCompanionDetailFetcher } from "@/api/companion.ts";
import { usePublishedResource } from "./usePublishedResource";

export function useCompanionDetail(sanitizedAccountName: string, companionName: string) {
  const resourceKey = `/account/${sanitizedAccountName}`;
  const params = { accountName: sanitizedAccountName, companionName };

  return usePublishedResource(resourceKey, params, (arg) => fetchCompanionDetailFetcher("", { arg }));
}
