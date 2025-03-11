import { fetchNotificationsFetcher } from "@/api/notification";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { extractEmojiSrc, redirectToLoginIfUnauthorized } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import useSWR from "swr";

export const Route = createFileRoute("/notification")({
  component: RouteComponent,
  beforeLoad: () => redirectToLoginIfUnauthorized(),
});

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useSWR(["/notifications", { page: currentPage }], ([url, arg]) =>
    fetchNotificationsFetcher(url, { arg }),
  );

  if (!data) return <div>Loading...</div>;

  const { notifications, page } = data;
  const nextPage = page.next;
  return (
    <div className="mt-4 flex flex-col items-center">
      <ul className="w-1/2">
        {notifications.map((notification) => (
          <li key={notification.id} className="border-b py-4">
            <span className="flex items-center gap-2 text-gray-500">
              <Link
                to={"/$accountName"}
                params={{
                  accountName: `@${notification.from.displayName}`,
                }}
                className="font-bold text-lg hover:underline"
              >
                {notification.from.name}
              </Link>{" "}
              reacted with{" "}
              <img
                src={extractEmojiSrc(notification.notifiable.reaction.emoji)}
                alt={notification.notifiable.reaction.emoji}
                className="h-5 w-5"
              />
              to: {notification.notifiable.reaction.tweet.text}
            </span>
          </li>
        ))}
      </ul>
      <Pagination className="my-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => nextPage && setCurrentPage(nextPage)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
