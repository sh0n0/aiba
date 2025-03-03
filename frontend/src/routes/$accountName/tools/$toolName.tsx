import { Button } from "@/components/ui/button";
import { useCompanionToolDetail } from "@/hooks/useCompanionToolDetail";
import { useCompanionToolPublishActions } from "@/hooks/useCompanionToolPublishActions";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";

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
  const { data, publishedAt, setPublishedAt } = useCompanionToolDetail(sanitizedAccountName, toolName);
  const { publish, unpublish } = useCompanionToolPublishActions(sanitizedAccountName, toolName, setPublishedAt);

  if (!data) {
    return <div>Loading...</div>;
  }

  const publishable = !publishedAt && data.url;
  const unpublishable = publishedAt && data.url;

  return (
    <div>
      {publishable && <Button onClick={publish}>Publish</Button>}
      {unpublishable && <Button onClick={unpublish}>Unpublish</Button>}
      <p>
        {data.creator.name}/{data.name}
      </p>
      <p>{data.description}</p>
      <p>{data.url}</p>
      <p>{publishedAt}</p>
    </div>
  );
}
