import { accountCompanionsFetcher } from "@/api/account";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import useSWR from "swr";

export const Route = createFileRoute("/$accountName/companions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { accountName } = useParams({ from: "/$accountName/companions/" });
  const sanitizedAccountName = accountName.replace(/^@/, "");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error } = useSWR(
    [`/account/${sanitizedAccountName}/companions`, { name: sanitizedAccountName, page: currentPage }],
    ([url, arg]) => accountCompanionsFetcher(url, { arg }),
  );

  if (error) return <div>Error loading companions.</div>;
  if (!data) return <div>Loading...</div>;

  const { companions, page } = data;
  const nextPage = page.next;

  return (
    <div className="flex flex-col items-center">
      <ul className="w-1/2">
        {companions.map((companion) => (
          <li key={companion.id} className="border-b py-4">
            <div className="flex flex-col">
              <Link
                to={"/$accountName/companions/$companionName"}
                params={{
                  accountName: accountName,
                  companionName: companion.name,
                }}
                className="w-fit font-bold text-blue-500 text-lg hover:underline"
              >
                {companion.name}
              </Link>
              <span className="text-gray-500">{companion.description}</span>
            </div>
          </li>
        ))}
      </ul>
      <Pagination>
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
