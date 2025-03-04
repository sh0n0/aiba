import { starCompanionFetcher, unstarCompanionFetcher } from "@/api/star";
import { useStarActions } from "./useStarActions";

export function useCompanionStarActions(sanitizedAccountName: string, companionName: string, initialStarred: boolean) {
  const params = { accountName: sanitizedAccountName, companionName };
  return useStarActions(
    "companions/star",
    starCompanionFetcher,
    "companions/unstar",
    unstarCompanionFetcher,
    params,
    initialStarred,
  );
}
