import { publishCompanionFetcher, unpublishCompanionFetcher } from "@/api/companion.ts";
import useSWRMutation from "swr/mutation";

export function useCompanionPublishActions(
  sanitizedAccountName: string,
  companionName: string,
  setPublishedAt: (publishedAt?: string) => void,
) {
  const { trigger: publishTrigger } = useSWRMutation("companions/publish", publishCompanionFetcher);
  const { trigger: unpublishTrigger } = useSWRMutation("companions/unpublish", unpublishCompanionFetcher);

  const publish = async () => {
    const response = await publishTrigger({ accountName: sanitizedAccountName, companionName });
    setPublishedAt(response.publishedAt);
  };

  const unpublish = async () => {
    await unpublishTrigger({ accountName: sanitizedAccountName, companionName });
    setPublishedAt(undefined);
  };

  return { publish, unpublish };
}
