import { fetchCompanionDetailFetcher } from "@/api/companion.ts";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import useSWR from "swr";

export const Route = createFileRoute("/$accountName/$companionName")({
  component: Account,
  beforeLoad: ({ params: { accountName } }) => {
    if (accountName === "@" || !accountName.startsWith("@")) {
      notFound({ throw: true });
    }
  },
});

function Account() {
  const { accountName, companionName } = useParams({
    from: "/$accountName/$companionName",
  });
  const sanitizedAccountName = accountName.replace(/^@/, "");
  const { data } = useSWR(
    [`/account/${sanitizedAccountName}`, { accountName: sanitizedAccountName, companionName: companionName }],
    ([_, arg]) => fetchCompanionDetailFetcher(_, { arg }),
  );

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>
        {data.creator.name}/{data.name}
      </p>
      <p>{data.description}</p>
      <p>{data.prompt}</p>
      <p>{data.publishedAt}</p>
    </div>
  );
}
