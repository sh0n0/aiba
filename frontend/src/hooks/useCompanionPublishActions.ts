import { publishCompanionFetcher, unpublishCompanionFetcher } from "@/api/companion.ts";
import { usePublishActions } from "./usePublishActions";

export function useCompanionPublishActions(
  sanitizedAccountName: string,
  companionName: string,
  setPublishedAt: (publishedAt?: string) => void,
) {
  return usePublishActions(
    "companions/publish",
    publishCompanionFetcher,
    "companions/unpublish",
    unpublishCompanionFetcher,
    { accountName: sanitizedAccountName, companionName },
    setPublishedAt,
  );
}
