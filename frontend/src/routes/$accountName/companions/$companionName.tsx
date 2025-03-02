import { StarButton } from "@/components/StarButton";
import { Button } from "@/components/ui/button";
import { useCompanionDetail } from "@/hooks/useCompanionDetail";
import { useCompanionPublishActions } from "@/hooks/useCompanionPublishActions";
import { useCompanionStarActions } from "@/hooks/useCompanionStarActions";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/$accountName/companions/$companionName")({
  component: Account,
  beforeLoad: ({ params: { accountName } }) => {
    if (accountName === "@" || !accountName.startsWith("@")) {
      notFound({ throw: true });
    }
  },
});

function Account() {
  const { accountName, companionName } = useParams({
    from: "/$accountName/companions/$companionName",
  });
  const sanitizedAccountName = accountName.replace(/^@/, "");

  const { data, publishedAt, setPublishedAt } = useCompanionDetail(sanitizedAccountName, companionName);
  const { publish, unpublish } = useCompanionPublishActions(sanitizedAccountName, companionName, setPublishedAt);

  const { starred, star, unstar } = useCompanionStarActions(
    sanitizedAccountName,
    companionName,
    data?.starred ?? false,
  );

  if (!data) {
    return <div>Loading...</div>;
  }

  const publishable = !publishedAt && data.prompt;
  const unpublishable = publishedAt && data.prompt;

  return (
    <div>
      {publishable && <Button onClick={publish}>Publish</Button>}
      {unpublishable && <Button onClick={unpublish}>Unpublish</Button>}
      <StarButton starred={starred} onToggle={starred ? unstar : star} />
      <p>
        {data.creator.name}/{data.name}
      </p>
      <p>{data.description}</p>
      <p>{data.prompt}</p>
      <p>{publishedAt}</p>
    </div>
  );
}
