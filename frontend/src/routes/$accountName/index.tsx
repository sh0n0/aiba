import { ACCOUNT_TWEET_PAGE_SIZE, type TweetResponse, accountFetcher, accountTweetsFetcher } from "@/api/account";
import { TweetCard } from "@/components/tweetCard";
import { API_BASE } from "@/constants/api";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

export const Route = createFileRoute("/$accountName/")({
  component: Account,
  beforeLoad: ({ params: { accountName } }) => {
    if (accountName === "@" || !accountName.startsWith("@")) {
      notFound({ throw: true });
    }
  },
});

function Account() {
  const { accountName } = useParams({ from: "/$accountName/" });
  const sanitizedAccountName = accountName.replace(/^@/, "");

  const { data: account } = useSWR([`/account/${sanitizedAccountName}`, { name: sanitizedAccountName }], ([_, arg]) =>
    accountFetcher(_, { arg }),
  );
  const { data: tweets, setSize } = useSWRInfinite((pageIndex: number, previousPageData: TweetResponse[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_BASE}/account/${sanitizedAccountName}/tweets?page=${pageIndex + 1}`;
  }, accountTweetsFetcher);

  const isReachingEnd = tweets && tweets[tweets.length - 1]?.length !== ACCOUNT_TWEET_PAGE_SIZE;
  const loadMore = useCallback(() => {
    if (!isReachingEnd) {
      setSize((prev) => prev + 1);
    }
  }, [isReachingEnd, setSize]);
  const infiniteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );
    if (infiniteRef.current) {
      observer.observe(infiniteRef.current);
    }
    return () => {
      if (infiniteRef.current) {
        observer.unobserve(infiniteRef.current);
      }
      observer.disconnect();
    };
  }, [loadMore]);

  if (!tweets || !account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {account.displayName} @{account.name}
      {tweets.map((page, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: This is a paginated list
        <div key={i}>
          {page.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      ))}
      {!isReachingEnd && <div ref={infiniteRef}>Loading more...</div>}
    </div>
  );
}
