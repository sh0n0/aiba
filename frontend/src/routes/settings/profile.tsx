import { myAccountFetcher, postAvatarFetcher } from "@/api/account";
import AvatarUploader from "@/components/AvatarUploader";
import { createFileRoute } from "@tanstack/react-router";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export const Route = createFileRoute("/settings/profile")({
  component: Profile,
});

function Profile() {
  const { data: account } = useSWR("settings/profile", myAccountFetcher);
  const { trigger } = useSWRMutation("settings/profile", postAvatarFetcher);

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <AvatarUploader
          avatarUrl={account.avatarUrl}
          onUpload={async (base64Image) => {
            await trigger({ base64Image });
          }}
        />
      </div>
      <div>
        {account.displayName} @{account.name}
      </div>
    </div>
  );
}
