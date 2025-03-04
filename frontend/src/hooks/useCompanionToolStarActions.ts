import { starCompanionToolFetcher, unstarCompanionToolFetcher } from "@/api/star";
import { useStarActions } from "./useStarActions";

export function useCompanionToolStarActions(sanitizedAccountName: string, toolName: string, initialStarred: boolean) {
  const params = { accountName: sanitizedAccountName, toolName };
  return useStarActions(
    "tools/star",
    starCompanionToolFetcher,
    "tools/unstar",
    unstarCompanionToolFetcher,
    params,
    initialStarred,
  );
}
