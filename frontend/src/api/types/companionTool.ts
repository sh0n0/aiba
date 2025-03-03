export type CompanionToolResponse = {
  id: number;
  name: string;
  description: string;
  creator: {
    name: string;
    displayName: string;
    createdAt: string;
  };
};

export type CompanionToolPageResponse = {
  tools: CompanionToolResponse[];
  page: {
    next: number | null;
  };
};

export type CompanionToolDetailResponse = {
  name: string;
  description: string;
  url: string | null;
  publishedAt: string;
  creator: {
    name: string;
    displayName: string;
  };
};
