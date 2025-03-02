import { fetchCompanionToolDetailFetcher } from "@/api/companionTool";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import useSWR from "swr";

export const Route = createFileRoute("/$accountName/tools/$toolName")({
  component: RouteComponent,
  beforeLoad: ({ params: { accountName } }) => {
    if (accountName === "@" || !accountName.startsWith("@")) {
      notFound({ throw: true });
    }
  },
});

function RouteComponent() {
  const { accountName, toolName } = useParams({
    from: "/$accountName/tools/$toolName",
  });
  const sanitizedAccountName = accountName.replace(/^@/, "");
  const { data } = useSWR(
    [`/account/${sanitizedAccountName}`, { accountName: sanitizedAccountName, toolName }],
    ([, arg]) => fetchCompanionToolDetailFetcher("", { arg }),
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
      <p>{data.url}</p>
    </div>
  );
}
