import { accountFetcher } from "@/api/account";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import useSWR from "swr";

export const Route = createFileRoute("/$accountName")({
  component: Account,
  beforeLoad: ({ params: { accountName } }) => {
    if (accountName === "@" || !accountName.startsWith("@")) {
      notFound({ throw: true });
    }
  },
});

function Account() {
  const { accountName } = useParams({ from: "/$accountName" });
  const sanitizedAccountName = accountName.replace(/^@/, "");
  const { data } = useSWR([`/account/${sanitizedAccountName}`, { name: sanitizedAccountName }], ([_, arg]) =>
    accountFetcher(_, { arg }),
  );

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data.displayName} @{data.name}
    </div>
  );
}
