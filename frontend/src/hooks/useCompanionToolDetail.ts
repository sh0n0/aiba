import { fetchCompanionToolDetailFetcher } from "@/api/companionTool";
import { usePublishedResource } from "./usePublishedResource";

export function useCompanionToolDetail(sanitizedAccountName: string, toolName: string) {
  const resourceKey = `/account/${sanitizedAccountName}/tool`;
  const params = { accountName: sanitizedAccountName, toolName };

  return usePublishedResource(resourceKey, params, (arg) => fetchCompanionToolDetailFetcher("", { arg }));
}
