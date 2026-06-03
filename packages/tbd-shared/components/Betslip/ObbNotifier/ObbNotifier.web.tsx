import { FunctionComponent, useCallback, useEffect, useContext } from "react";
import { BetslipNotifications } from "@ppb/the-wall-web";
import { AlertProps } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import { NotificationCode } from "../betslip-notification-code";
import { notificationValidator, useNotificationShown } from "../../../helpers/useNotificationShown";
import { GTM_NOTIFICATIONS } from "../../../helpers/notifier-helper";
import { KeyboardContext } from "../Keyboard/KeyboardContext";

export const ObbNotifier: FunctionComponent<ComponentProps> = ({
  className,
  notifications,
  isBetslipCollapsed,
  validations,
  dispatchObbValidateStake,
  dispatchObbNotificationShown,
  dispatchExternalPush,
  dispatchMaxPayoutNotificationAccepted,
  dispatchObbMaxPayoutNotificationUrlClick,
}) => {
  const {
    focusedKeyboardControls: { focusedTargetRef },
  } = useContext(KeyboardContext);

  useEffect(() => {
    const element = focusedTargetRef?.current;
    if (!element || notifications.length === 0 || isBetslipCollapsed) return;

    if (notifications.length > 0) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusedTargetRef, isBetslipCollapsed, notifications]);

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
      if (dispatchExternalPush && GTM_NOTIFICATIONS.includes(id as NotificationCode)) {
        dispatchObbMaxPayoutNotificationUrlClick(url);
        dispatchExternalPush(url);
      }
    },
    [dispatchExternalPush, dispatchObbMaxPayoutNotificationUrlClick],
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
        onAlertClick={dispatchObbValidateStake}
        onAlertUrlClick={onNotificationUrlClickCallback}
        onAlertClose={onNotificationCloseCallback}
      />
    </div>
  );
};
