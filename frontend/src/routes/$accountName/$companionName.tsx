import { Button } from "@/components/ui/button";
import { useCompanionDetail } from "@/hooks/useCompanionDetail";
import { useCompanionPublishActions } from "@/hooks/useCompanionPublishActions";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";

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

  const { data, publishedAt, setPublishedAt } = useCompanionDetail(sanitizedAccountName, companionName);
  const { publish, unpublish } = useCompanionPublishActions(sanitizedAccountName, companionName, setPublishedAt);

  if (!data) {
    return <div>Loading...</div>;
  }

  const publishable = !publishedAt && data.prompt;
  const unpublishable = publishedAt && data.prompt;

  return (
    <div>
      {publishable && <Button onClick={publish}>Publish</Button>}
      {unpublishable && <Button onClick={unpublish}>Unpublish</Button>}
      <p>
        {data.creator.name}/{data.name}
      </p>
      <p>{data.description}</p>
      <p>{data.prompt}</p>
      <p>{publishedAt}</p>
    </div>
  );
}
