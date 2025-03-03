import { publishCompanionToolFetcher, unpublishCompanionToolFetcher } from "@/api/companionTool";
import { usePublishActions } from "./usePublishActions";

export function useCompanionToolPublishActions(
  sanitizedAccountName: string,
  toolName: string,
  setPublishedAt: (publishedAt?: string) => void,
) {
  return usePublishActions(
    "companions/tool/publish",
    publishCompanionToolFetcher,
    "companions/tool/unpublish",
    unpublishCompanionToolFetcher,
    { accountName: sanitizedAccountName, toolName },
    setPublishedAt,
  );
}
