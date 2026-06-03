import { FunctionComponent, useState, useEffect, useCallback } from "react";
import { Platform, DeviceEventEmitter } from "react-native";
import { NotificationPrompt } from "@ppb/the-wall-native";
import { PNLabelsEnum, PNModulesEnum } from "@ppb/tbd-store/middlewares/tagging-resolvers/interface";
import { Brand } from "@ppb/tbd-store/config/Brand";
import Storage from "../../helpers/storage.native";
import { ComponentProps } from "./props";
import {
  registerNotificationOptinListener,
  removeNotificationOptinListener,
  showNativePushPrompt,
  updateRegistration,
  retrieveSystemNotificationStatus,
} from "../../helpers/push-notifications.native";
import config from "../../config/app-configuration.native";
import { showCookieConsentBannerAfterDelay } from "../../cookie-consent/cookie-consent.native";
import { useIsReadyToShow } from "./useIsReadyToShow.native";

const NotificationsInitialPrompt: FunctionComponent<ComponentProps> = ({
  isLoggedIn,
  titleLabel,
  descriptionLabel,
  acceptLabel,
  rejectLabel,
  dispatchRegisterDevice,
  dispatchNativePromptShown,
  dispatchPushNotificationEvent,
}) => {
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  const retrieveSystemNotificationStatusCallback = useCallback(
    (isEnabled: boolean) => {
      if (!isEnabled) {
        const versionNumber = typeof Platform.Version === "string" ? parseInt(Platform.Version, 10) : Platform.Version;
        // On Android, only trigger the notification permission prompt journey from Android 13 (API level 33)
        // https://developer.android.com/develop/ui/views/notifications/notification-permission#best-practices
        if (Platform.OS === "android" && versionNumber < 33) {
          return;
        }
        Storage.getItem("wasNotificationsPromptShown").then((wasNotificationsPromptShown) => {
          if (isLoggedIn && !wasNotificationsPromptShown) {
            if (config.appBrand === Brand.Skybet) {
              setShowNotificationPrompt(true);
            } else {
              let hasNotificationBeenShown = false;
              DeviceEventEmitter.addListener("ON_FINISH_SETUP_BIOMETRIC", () => {
                if (!hasNotificationBeenShown) {
                  setShowNotificationPrompt(true);
                  hasNotificationBeenShown = true;
                }
              });
            }
          }
        });
      }
    },
    [isLoggedIn],
  );

  useEffect(() => {
    registerNotificationOptinListener(isLoggedIn, dispatchRegisterDevice);

    updateRegistration(isLoggedIn, dispatchRegisterDevice);

    retrieveSystemNotificationStatus().then(retrieveSystemNotificationStatusCallback);

    return () => removeNotificationOptinListener();
  }, [dispatchRegisterDevice, isLoggedIn, retrieveSystemNotificationStatusCallback]);

  const closeNotificationsPrompt = useCallback((): void => {
    Storage.setItem("wasNotificationsPromptShown", true);
    setShowNotificationPrompt(false);
    if (config.appBrand === Brand.Skybet && Platform.OS === "ios") {
      showCookieConsentBannerAfterDelay();
    }
  }, []);

  const handleNotificationPromptSuccess = useCallback(async () => {
    closeNotificationsPrompt();
    showNativePushPrompt(dispatchNativePromptShown);
    dispatchPushNotificationEvent(acceptLabel, PNModulesEnum.NOTIFICATION);
  }, [closeNotificationsPrompt, dispatchNativePromptShown, dispatchPushNotificationEvent, acceptLabel]);

  const handleNotificationPromptRejection = useCallback(() => {
    closeNotificationsPrompt();
    dispatchPushNotificationEvent(rejectLabel, PNModulesEnum.NOTIFICATION);
  }, [closeNotificationsPrompt, dispatchPushNotificationEvent, rejectLabel]);

  const handleCloseTap = useCallback(() => {
    closeNotificationsPrompt();
    dispatchPushNotificationEvent(PNLabelsEnum.CLOSE, PNModulesEnum.CONFIRMATION);
  }, [closeNotificationsPrompt, dispatchPushNotificationEvent]);

  if (!showNotificationPrompt) {
    return null;
  }

  return (
    <NotificationPrompt
      title={titleLabel}
      description={descriptionLabel}
      onCloseTap={handleCloseTap}
      primaryButtonLabel={acceptLabel}
      secondaryButtonLabel={rejectLabel}
      onPrimaryButtonTap={handleNotificationPromptSuccess}
      onSecondaryButtonTap={handleNotificationPromptRejection}
    />
  );
};

// This wrapper was created as a temporary quickfix to unblock a release: [https://jira.services.flutteruki.com/browse/OCISLY-695]
// while we investigate an issue where the notification prompt modal breaks the whole iOS app when it is shown before the OneTrust consent is given.
// The root cause of that issue is still unknown
const NotificationsInitialPromptWrapper = (props: ComponentProps) => {
  const isReadyToShow = useIsReadyToShow();

  return isReadyToShow ? <NotificationsInitialPrompt {...props} /> : null;
};

export default NotificationsInitialPromptWrapper;
