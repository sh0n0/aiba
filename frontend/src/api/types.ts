export type TweetResponse = {
  id: number;
  text: string;
  companionComment: {
    id: number;
    text: string;
    companion: {
      name: string;
      description: string;
      publishedAt: string | null;
      creator: {
        name: string;
        displayName: string;
        createdAt: string;
      };
    };
  };
  account: {
    name: string;
    displayName: string;
    avatarUrl: string;
    createdAt: string;
  };
};
