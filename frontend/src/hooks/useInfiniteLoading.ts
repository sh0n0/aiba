import { useCallback } from "react";

export function useInfiniteLoading<T>(
  tweets: T[][] | undefined,
  setSize: (updater: (prev: number) => number) => void,
  pageSize: number,
) {
  const isReachingEnd = tweets && tweets[tweets.length - 1]?.length !== pageSize;

  const loadMore = useCallback(() => {
    if (!isReachingEnd) {
      setSize((prev) => prev + 1);
    }
  }, [isReachingEnd, setSize]);

  return { isReachingEnd, loadMore };
}
