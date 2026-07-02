export type Notification = {
  hasUnread: boolean;
};

// TODO: replace with a backend-fetched notification summary (API route / websocket / store).
export const notificationStatus: Notification = {
  hasUnread: true,
};
