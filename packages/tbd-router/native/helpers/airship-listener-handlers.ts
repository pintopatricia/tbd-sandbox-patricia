import { Notification } from "react-native-notifications";
import { buildNotificationEvent, NotificationEvent } from "tagging-library";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { UANotification, getInfoFromPush } from "./get-url-from-push";

export const notificationReceivedHandler = (
  notification: Notification | UANotification,
  notificationText: string,
  appBrand: Brand,
  sendEvent: (event: NotificationEvent) => void,
): void => {
  const { url, pushMessagePlatform } = getInfoFromPush(notification, appBrand);
  const event = buildNotificationEvent({
    action: TaggingAction.RECEIVED_MESSAGE,
    elementText: notificationText ?? "null",
    pushMessagePlatform: pushMessagePlatform ?? "null",
    destinationUrl: url ?? "null",
  });

  sendEvent(event);
};

export const notificationSawHandler = (
  notification: Notification | UANotification,
  notificationText: string,
  appBrand: Brand,
  sendEvent: (event: NotificationEvent) => void,
): void => {
  const { pushMessagePlatform } = getInfoFromPush(notification, appBrand);
  const event = buildNotificationEvent({
    action: TaggingAction.SAW_MESSAGE,
    elementText: notificationText ?? "null",
    pushMessagePlatform: pushMessagePlatform ?? "null",
    destinationUrl: "null",
  });

  sendEvent(event);
};
