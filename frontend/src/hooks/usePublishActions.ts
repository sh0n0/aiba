import useSWRMutation from "swr/mutation";

export function usePublishActions<T extends { publishedAt?: string }, P extends Record<string, unknown>>(
  publishKey: string,
  publishFetcher: (key: string, { arg }: { arg: P }) => Promise<T>,
  unpublishKey: string,
  unpublishFetcher: (key: string, { arg }: { arg: P }) => Promise<T>,
  params: P,
  setPublishedAt: (publishedAt?: string) => void,
) {
  const { trigger: publishTrigger } = useSWRMutation(publishKey, publishFetcher);
  const { trigger: unpublishTrigger } = useSWRMutation(unpublishKey, unpublishFetcher);

  const publish = async () => {
    const response = await (publishTrigger as (arg: P) => Promise<T>)(params);
    setPublishedAt(response.publishedAt);
  };

  const unpublish = async () => {
    await (unpublishTrigger as (arg: P) => Promise<T>)(params);
    setPublishedAt(undefined);
  };

  return { publish, unpublish };
}
