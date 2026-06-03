export const NETWORK__FETCH_UNREAD_NOTIFICATIONS = "NETWORK/FETCH_UNREAD_NOTIFICATIONS";

export const NETWORK__UNREAD_NOTIFICATIONS_SUCCESS = "NETWORK/UNREAD_NOTIFICATIONS_SUCCESS";

export const NETWORK__UNREAD_NOTIFICATIONS_FAILURE = "NETWORK/UNREAD_NOTIFICATIONS_FAILURE";

export type FetchUnreadNotificationsAction = {
  type: typeof NETWORK__FETCH_UNREAD_NOTIFICATIONS;
};

export type UnreadNotificationsSuccessAction = {
  type: typeof NETWORK__UNREAD_NOTIFICATIONS_SUCCESS;
  payload: {
    unreadNotificationsCount: number;
  };
};

export type UnreadNotificationsFailureAction = {
  type: typeof NETWORK__UNREAD_NOTIFICATIONS_FAILURE;
};
