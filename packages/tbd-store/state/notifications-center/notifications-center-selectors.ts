import { NotificationsCenterState } from "./NotificationsCenterState.types";

export const getUnreadNotificationsCount = (state: NotificationsCenterState): number => state.unreadNotificationsCount;
