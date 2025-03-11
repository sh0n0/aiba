export type NotificationResponse = {
  id: number;
  from: {
    name: string;
    displayName: string;
  };
  notifiable: {
    reaction: {
      emoji: string;
      tweet: {
        id: string;
        text: string;
      };
    };
  };
};

export type NotificationPageResponse = {
  notifications: NotificationResponse[];
  page: {
    next: number | null;
  };
};
