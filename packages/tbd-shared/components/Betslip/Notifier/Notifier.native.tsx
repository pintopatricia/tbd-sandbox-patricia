import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { Alerts } from "@ppb/the-wall-native";
import { AlertProps } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import { notificationValidator, useNotificationShown } from "../../../helpers/useNotificationShown";
import { NotificationCode } from "../betslip-notification-code";
import { GTM_NOTIFICATIONS } from "../../../helpers/notifier-helper";

export const Notifier: FunctionComponent<ComponentProps> = ({
  style,
  notifications,
  validations,
  dispatchSportsbookValidateStake,
  dispatchSportsbookNotificationShown,
  dispatchSportsbookMaxPayoutNotificationUrlClick,
  dispatchMaxPayoutNotificationAccepted,
}) => {
  const shouldHandleNotification = useCallback(
    (notification: AlertProps, whitelistNotificationCodes: Array<string>) =>
      notificationValidator(notification, whitelistNotificationCodes, validations),
    [validations],
  );

  useNotificationShown(
    notifications,
    GTM_NOTIFICATIONS,
    (gtmLabel) => dispatchSportsbookNotificationShown(gtmLabel),
    shouldHandleNotification,
  );

  const onNotificationUrlClickCallback = useCallback(
    (id: string, url: string) => {
      if (dispatchSportsbookMaxPayoutNotificationUrlClick && GTM_NOTIFICATIONS.includes(id as NotificationCode)) {
        dispatchSportsbookMaxPayoutNotificationUrlClick(url);
      }
    },
    [dispatchSportsbookMaxPayoutNotificationUrlClick],
  );

  const onNotificationCloseCallback = useCallback(
    (id?: string) => {
      if (id && id === NotificationCode.MaxPayoutInfo) {
        dispatchMaxPayoutNotificationAccepted();
      }
    },
    [dispatchMaxPayoutNotificationAccepted],
  );

  if (!notifications.length) {
    return null;
  }

  return (
    <View style={style}>
      <Alerts
        alerts={notifications}
        onAlertClick={dispatchSportsbookValidateStake}
        onAlertUrlClick={onNotificationUrlClickCallback}
        onAlertClose={onNotificationCloseCallback}
      />
    </View>
  );
};
