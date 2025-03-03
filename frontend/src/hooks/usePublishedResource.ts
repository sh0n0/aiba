import { useEffect, useState } from "react";
import useSWR from "swr";

export function usePublishedResource<T extends { publishedAt?: string | undefined }, P extends Record<string, unknown>>(
  resourceKey: string,
  params: P,
  fetcher: (arg: P) => Promise<T>,
) {
  const { data, error } = useSWR([resourceKey, params], ([, arg]) => fetcher(arg));

  const [publishedAt, setPublishedAt] = useState(data?.publishedAt);

  useEffect(() => {
    if (data) {
      setPublishedAt(data.publishedAt);
    }
  }, [data]);

  return { data, publishedAt, setPublishedAt, error };
}
