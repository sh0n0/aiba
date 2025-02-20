import { starCompanionFetcher, unstarCompanionFetcher } from "@/api/companionStar";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";

export function useCompanionStarActions(sanitizedAccountName: string, companionName: string, initialStarred: boolean) {
  const [starred, setStarred] = useState(initialStarred);

  useEffect(() => {
    setStarred(initialStarred);
  }, [initialStarred]);

  const { trigger: starTrigger } = useSWRMutation("companions/star", starCompanionFetcher);
  const { trigger: unstarTrigger } = useSWRMutation("companions/unstar", unstarCompanionFetcher);

  const star = async () => {
    await starTrigger({ accountName: sanitizedAccountName, companionName });
    setStarred(true);
  };

  const unstar = async () => {
    await unstarTrigger({ accountName: sanitizedAccountName, companionName });
    setStarred(false);
  };

  return { starred, star, unstar };
}
