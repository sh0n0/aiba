import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";

export function useStarActions<P extends Record<string, unknown>, R>(
  starKey: string,
  starFetcher: (key: string, { arg }: { arg: P }) => Promise<R>,
  unstarKey: string,
  unstarFetcher: (key: string, { arg }: { arg: P }) => Promise<R>,
  params: P,
  initialStarred: boolean,
) {
  const [starred, setStarred] = useState(initialStarred);

  useEffect(() => {
    setStarred(initialStarred);
  }, [initialStarred]);

  const { trigger: starTrigger } = useSWRMutation(starKey, starFetcher);
  const { trigger: unstarTrigger } = useSWRMutation(unstarKey, unstarFetcher);

  const star = async () => {
    await (starTrigger as (arg: P) => Promise<R>)(params);
    setStarred(true);
  };

  const unstar = async () => {
    await (unstarTrigger as (arg: P) => Promise<R>)(params);
    setStarred(false);
  };

  return { starred, star, unstar };
}
