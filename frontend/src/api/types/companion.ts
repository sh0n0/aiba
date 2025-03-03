export type CompanionResponse = {
  id: number;
  name: string;
  description: string;
  creator: {
    name: string;
    displayName: string;
    createdAt: string;
  };
};

export type CompanionPageResponse = {
  companions: CompanionResponse[];
  page: {
    next: number | null;
  };
};

export type CompanionDetailResponse = {
  name: string;
  description: string;
  prompt: string | null;
  publishedAt: string;
  creator: {
    name: string;
    displayName: string;
  };
  starred: boolean;
  starredCount: number;
};
