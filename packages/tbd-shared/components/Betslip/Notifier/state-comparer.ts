import { AlertProps } from "@ppb/the-wall-common/types";
import { StateProps } from "./map-to-props-factory";

type AllNotificationPropsComparison = {
  [k in `${keyof AlertProps}Comparison`]: boolean;
};

const compareAllNotificationProps = (
  oldNotification: AlertProps,
  newNotification: AlertProps,
): AllNotificationPropsComparison => ({
  idComparison: oldNotification.id === newNotification.id,
  messageComparison: oldNotification.message === newNotification.message,
  detailComparison: oldNotification.detail === newNotification.detail,
  extraDetailInfoComparison: oldNotification.extraDetailInfo === newNotification.extraDetailInfo,
  hasClickableActionComparison: oldNotification.hasClickableAction === newNotification.hasClickableAction,
  typeComparison: oldNotification.type === newNotification.type,
  itemsComparison: oldNotification.items?.join(",") === newNotification.items?.join(","),
  urlComparison: oldNotification.url === newNotification.url,
  showCloseIconComparison: oldNotification.showCloseIcon === newNotification.showCloseIcon,
  dismissLabelComparison: oldNotification.dismissLabel === newNotification.dismissLabel,
  gtmLabelComparison: oldNotification.gtmLabel === newNotification.gtmLabel,
  iconOverloadComparison: oldNotification.iconOverload === newNotification.iconOverload,
  actionComparison: oldNotification.action === newNotification.action,
});

const areNotificationsEqual = (oldNotification: AlertProps, newNotification: AlertProps): boolean => {
  const comparison = compareAllNotificationProps(oldNotification, newNotification);
  return Object.values(comparison).every(Boolean);
};

export const areStatePropsEqual = (next: StateProps | false, prev: StateProps | false): boolean => {
  if (next === false) {
    return next === prev;
  }

  if (prev === false) {
    return false;
  }

  const { notifications: nextNotifications } = next;
  const { notifications: prevNotifications } = prev;

  if (nextNotifications.length !== prevNotifications.length) {
    return false;
  }

  return nextNotifications.every((newNotification, index) =>
    areNotificationsEqual(prevNotifications[index], newNotification),
  );
};
