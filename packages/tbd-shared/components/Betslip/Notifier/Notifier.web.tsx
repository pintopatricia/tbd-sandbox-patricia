import { FunctionComponent, useCallback, useContext, useEffect } from "react";
import { BetslipNotifications } from "@ppb/the-wall-web";
import { AlertProps } from "@ppb/the-wall-common/types";
import { NotificationCode } from "../betslip-notification-code";
import { ComponentProps } from "./props";
import { notificationValidator, useNotificationShown } from "../../../helpers/useNotificationShown";
import { GTM_NOTIFICATIONS } from "../../../helpers/notifier-helper";
import { KeyboardContext } from "../Keyboard/KeyboardContext";

export const Notifier: FunctionComponent<ComponentProps> = ({
  className,
  notifications,
  isBetslipCollapsed,
  validations,
  dispatchSportsbookValidateStake,
  dispatchSportsbookNotificationShown,
  dispatchExternalPush,
  dispatchMaxPayoutNotificationAccepted,
  dispatchSportsbookMaxPayoutNotificationUrlClick,
}) => {
  const {
    focusedKeyboardControls: { focusedTargetRef },
  } = useContext(KeyboardContext);

  useEffect(() => {
    const element = focusedTargetRef?.current;
    if (!element || notifications.length === 0 || isBetslipCollapsed) return;

    element.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [focusedTargetRef, isBetslipCollapsed, notifications]);

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
      if (dispatchExternalPush && GTM_NOTIFICATIONS.includes(id as NotificationCode)) {
        dispatchSportsbookMaxPayoutNotificationUrlClick(url);
        dispatchExternalPush(url);
      }
    },
    [dispatchExternalPush, dispatchSportsbookMaxPayoutNotificationUrlClick],
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
    <div className={className}>
      <BetslipNotifications
        alerts={notifications}
        onAlertClick={dispatchSportsbookValidateStake}
        onAlertUrlClick={onNotificationUrlClickCallback}
        onAlertClose={onNotificationCloseCallback}
      />
    </div>
  );
};
