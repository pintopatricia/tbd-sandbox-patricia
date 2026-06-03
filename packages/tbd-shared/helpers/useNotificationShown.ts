import { useRef, useEffect } from "react";
import { AlertProps } from "@ppb/the-wall-common/types";
import { NotificationCode } from "../components/Betslip/betslip-notification-code";
import {
  SportsbookValidation,
  NOTIFICATION_TYPES as SBK_NOTIFICATION_TYPES,
} from "../components/Betslip/Notifier/notifier-mapper";
import {
  ObbValidation,
  NOTIFICATION_TYPES as OBB_NOTIFICATION_TYPES,
} from "../components/Betslip/ObbNotifier/obb-notifier-mapper";

type NotificationHandler = (label: string) => void;
export type NotificationValidator = (notification: AlertProps, whitelistNotificationCodes: Array<string>) => boolean;

export const notificationValidator = (
  notification: AlertProps,
  whitelistNotificationCodes: Array<string>,
  validations: Array<
    | SportsbookValidation
    | ObbValidation
    | {
        type: SBK_NOTIFICATION_TYPES | OBB_NOTIFICATION_TYPES;
        notification: AlertProps;
      }
  >,
): boolean =>
  !!notification.id &&
  (whitelistNotificationCodes.includes(notification.id) ||
    validations.some(
      (validation) =>
        validation.notification?.id === notification.id && whitelistNotificationCodes.includes(validation.type),
    ));

/**
 * Handles notifications and triggers a handler for those whose ID matches a whitelist (default condition).
 *
 * @param notifications - List of notifications to be checked.
 * @param whitelistNotificationCodes - List of valid notification IDs (or codes).
 * @param handler - Function to call when notifications matches with default or exception conditions.
 * @param isNotificationHandleable - Function to handle notifications that don't match the whitelist.
 *
 */
export const useNotificationShown = (
  notifications: AlertProps[],
  whitelistNotificationCodes: Array<NotificationCode | string>,
  handler: NotificationHandler,
  isNotificationHandleable: NotificationValidator,
): void => {
  const NOTIFICATIONS_CODE_MAPPER = whitelistNotificationCodes.reduce(
    (acc: { [key: string]: boolean }, id) => ({
      ...acc,
      [id]: false,
    }),
    {},
  );

  // If the notification has been dispatched at any time
  const notificationDispatched = useRef({ ...NOTIFICATIONS_CODE_MAPPER });

  useEffect(() => {
    // Keep track of the current shown notification
    const notificationDispatchedCurrent = { ...NOTIFICATIONS_CODE_MAPPER };

    notifications.forEach((notification) => {
      // The notification attempts to match its ID with the whitelist of notification codes.
      // However, it allows you to define a custom function to handle specific cases or exceptions
      // where the default matching logic might not apply.
      if (notification.id && isNotificationHandleable(notification, whitelistNotificationCodes)) {
        if (!notificationDispatched.current[notification.id]) {
          if (notification.gtmLabel) {
            handler(notification.gtmLabel);
          }
          notificationDispatched.current[notification.id] = true;
        }

        notificationDispatchedCurrent[notification.id] = true;
      }
    });

    // If the requested notification id was showed in the current cycle,
    // it means we can reset the notificationDispatched value since we want
    // the event to be dispatched next time the notification appears again
    notificationDispatched.current = notificationDispatchedCurrent;
  }, [
    notifications,
    whitelistNotificationCodes,
    notificationDispatched,
    handler,
    isNotificationHandleable,
    NOTIFICATIONS_CODE_MAPPER,
  ]);
};
