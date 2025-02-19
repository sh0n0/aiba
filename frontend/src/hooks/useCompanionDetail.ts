import { fetchCompanionDetailFetcher } from "@/api/companion.ts";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function useCompanionDetail(sanitizedAccountName: string, companionName: string) {
  const { data, error } = useSWR(
    [`/account/${sanitizedAccountName}`, { accountName: sanitizedAccountName, companionName }],
    ([, arg]) => fetchCompanionDetailFetcher("", { arg }),
  );
  const [publishedAt, setPublishedAt] = useState(data?.publishedAt);

  useEffect(() => {
    if (data) {
      setPublishedAt(data.publishedAt);
    }
  }, [data]);

  return { data, publishedAt, setPublishedAt, error };
}
