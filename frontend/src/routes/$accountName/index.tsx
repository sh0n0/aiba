import { accountFetcher, accountTweetsFetcher } from "@/api/account";
import type { TweetResponse } from "@/api/types";
import { InfiniteScrollObserver } from "@/components/InfiniteScrollObserver";
import { TweetCard } from "@/components/TweetCard";
import { ACCOUNT_TWEET_PAGE_SIZE, API_BASE } from "@/constants/api";
import { useInfiniteLoading } from "@/hooks/useInfiniteLoading";
import { Link, createFileRoute, notFound, useParams } from "@tanstack/react-router";
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

  const { data: account } = useSWR([`/account/${sanitizedAccountName}`, { name: sanitizedAccountName }], ([url, arg]) =>
    accountFetcher(url, { arg }),
  );
  const { data: tweets, setSize } = useSWRInfinite((pageIndex: number, previousPageData: TweetResponse[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${API_BASE}/account/${sanitizedAccountName}/tweets?page=${pageIndex + 1}`;
  }, accountTweetsFetcher);

  // Use the custom hook for infinite loading
  const { isReachingEnd, loadMore } = useInfiniteLoading(tweets, setSize, ACCOUNT_TWEET_PAGE_SIZE);

  if (!tweets || !account) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <img src={account.avatarUrl} alt="avatar" className="h-10 w-10 rounded-full" />
        <div>
          {account.displayName} @{account.name}
        </div>
        <Link to={"/$accountName/companions"} params={{ accountName: accountName }} className="hover:underline">
          {account.companionsCount} companions
        </Link>
        <Link to={"/$accountName/tools"} params={{ accountName: accountName }} className="hover:underline">
          {account.companionToolsCount} tools
        </Link>
      </div>

      {tweets.map((page, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: This is a paginated list
        <div key={i}>
          {page.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      ))}

      {!isReachingEnd && <InfiniteScrollObserver onIntersect={loadMore}>Loading more...</InfiniteScrollObserver>}
    </div>
  );
}
