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
