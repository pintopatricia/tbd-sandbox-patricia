import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { Alerts } from "@ppb/the-wall-native";
import { AlertProps } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import { notificationValidator, useNotificationShown } from "../../../helpers/useNotificationShown";
import { GTM_NOTIFICATIONS } from "../../../helpers/notifier-helper";
import { NotificationCode } from "../betslip-notification-code";

export const ObbNotifier: FunctionComponent<ComponentProps> = ({
  style,
  notifications,
  validations,
  dispatchObbValidateStake,
  dispatchObbNotificationShown,
  dispatchObbMaxPayoutNotificationUrlClick,
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
    (gtmLabel) => dispatchObbNotificationShown(gtmLabel),
    shouldHandleNotification,
  );

  const onNotificationUrlClickCallback = useCallback(
    (id: string, url: string) => {
      if (dispatchObbMaxPayoutNotificationUrlClick && GTM_NOTIFICATIONS.includes(id as NotificationCode)) {
        dispatchObbMaxPayoutNotificationUrlClick(url);
      }
    },
    [dispatchObbMaxPayoutNotificationUrlClick],
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
        onAlertClick={dispatchObbValidateStake}
        onAlertUrlClick={onNotificationUrlClickCallback}
        onAlertClose={onNotificationCloseCallback}
      />
    </View>
  );
};
