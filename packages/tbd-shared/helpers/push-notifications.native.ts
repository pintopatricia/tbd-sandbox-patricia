/* global __DEV__ */
import { Platform, NativeModules } from "react-native";
import { EventType, iOS, UrbanAirship } from "urbanairship-react-native";
import DeviceInfo from "react-native-device-info";
import { Platform as PLATFORM, RegisterOptions } from "@ppb/tbd-store/state/entities/notifications/Notifications";
import { PNNativePromptShownAction, PNRegisterDeviceAction } from "@ppb/tbd-store/actions/push-notifications";
import { MobileCore } from "@adobe/react-native-aepcore";
import config from "../config/app-configuration.native";
import { getAdobeSdkConfig } from "../config/endpoints";
import Storage from "./storage.native";

const { AirshipConfigModule } = NativeModules;

export const retrieveSystemNotificationStatus = (): Promise<boolean> =>
  UrbanAirship.isSystemNotificationsEnabledForApp();

export const getRegisterDeviceDetails = async (): Promise<{
  applicationTypeId: string;
  deviceId: string;
  deviceOptions: RegisterOptions;
} | null> => {
  const OS = Platform.OS as "android" | "ios";

  const uaChannelId = await UrbanAirship.getChannelId();
  const registrationToken = await UrbanAirship.getRegistrationToken();
  const isSystemNotificationsEnabledForApp = await UrbanAirship.isSystemNotificationsEnabledForApp();
  const applicationTypeId = await AirshipConfigModule.getAppKey();
  // Build number that is used to distinguish between SMX Wrapper and Rebuild App.
  const applicationBuildNumber = DeviceInfo.getBuildNumber();

  let deviceId;

  // The device token that uniquely identifies a device
  // iOS applications should send the APNS device token and the Android applications should send the UA channel id
  if (OS === "android") {
    deviceId = uaChannelId;
  } else {
    deviceId = registrationToken;
  }

  const adobeAndroidIntegrationKey = __DEV__
    ? config.appConfig?.ADOBE_APP_KEYS.android.dev
    : config.appConfig?.ADOBE_APP_KEYS.android.prod;
  const adobeiOSIntegrationKey = __DEV__
    ? config.appConfig?.ADOBE_APP_KEYS.ios.dev
    : config.appConfig?.ADOBE_APP_KEYS.ios.prod;
  const { ADOBE_TRACKING_SERVER, ADOBE_MARKETING_SERVER } = getAdobeSdkConfig() || {};

  MobileCore.updateConfiguration({
    "build.environment": __DEV__ ? "dev" : "prod",
    "campaignclassic.ios.integrationKey": adobeiOSIntegrationKey,
    "campaignclassic.android.integrationKey": adobeAndroidIntegrationKey,
    "campaignclassic.trackingServer": ADOBE_TRACKING_SERVER,
    "campaignclassic.marketingServer": ADOBE_MARKETING_SERVER,
    "global.privacy": "optedin",
  });

  if (registrationToken && uaChannelId && deviceId) {
    const deviceOptions = {
      notificationPreferences: {
        globalNotifications: isSystemNotificationsEnabledForApp,
      },
      deviceDetails: {
        platform: OS === "android" ? PLATFORM.android : PLATFORM.ios,
        deviceToken: registrationToken,
        uaChannelId,
      },
      applicationDetails: {
        version: applicationBuildNumber,
      },
    };

    return { applicationTypeId, deviceId, deviceOptions };
  }

  return null;
};

export const showNativePushPrompt = async (
  dispatchNativePromptShown: () => PNNativePromptShownAction,
): Promise<void> => {
  await UrbanAirship.enableUserPushNotifications();
  // for iOS we need to store that the native prompt was shown so that when the user tries to subscribe
  // we know that we can't show the prompt again and we redirect the user to the native settings
  await Storage.setItem("wasNotificationNativePromptShown", true);
  dispatchNativePromptShown();
};

export const updateRegistration = async (
  isLoggedIn: boolean,
  dispatchRegisterDevice: (
    applicationTypeId: string,
    deviceId: string,
    deviceOptions: RegisterOptions,
  ) => PNRegisterDeviceAction,
): Promise<void> => {
  const { OS } = Platform;

  const wasNotificationsPromptShown = await Storage.getItem("wasNotificationsPromptShown");
  const notificationStatus = await UrbanAirship.getNotificationStatus();

  // when the user opted-in/out previously without using the Notifications Prompt (e.g. SMX app) we shouldn't show the Notifications Prompt again
  if (
    OS === "ios" &&
    wasNotificationsPromptShown === undefined &&
    notificationStatus.ios?.authorizedStatus &&
    notificationStatus.ios?.authorizedStatus !== iOS.AuthorizedNotificationStatus.NotDetermined
  ) {
    await Storage.setItem("wasNotificationsPromptShown", true);
  }

  if (isLoggedIn) {
    const registerDetails = await getRegisterDeviceDetails();

    if (OS === "android") {
      const isPushEnabled = await retrieveSystemNotificationStatus();
      UrbanAirship.setUserNotificationsEnabled(isPushEnabled);

      if (registerDetails) {
        const { applicationTypeId, deviceId, deviceOptions } = registerDetails;
        dispatchRegisterDevice(applicationTypeId, deviceId, deviceOptions);
      }
      // when the user opted-in previously we should re-register the device in NSS to update to the current appVersion
    } else if (
      OS === "ios" &&
      notificationStatus.ios?.authorizedStatus &&
      notificationStatus.ios?.authorizedStatus === iOS.AuthorizedNotificationStatus.Authorized
    ) {
      if (registerDetails) {
        const { applicationTypeId, deviceId, deviceOptions } = registerDetails;
        dispatchRegisterDevice(applicationTypeId, deviceId, deviceOptions);
      }
    }
  }
};

export const registerNotificationOptinListener = async (
  isLoggedIn: boolean,
  dispatchRegisterDevice: (
    applicationTypeId: string,
    deviceId: string,
    deviceOptions: RegisterOptions,
  ) => PNRegisterDeviceAction,
): Promise<void> => {
  UrbanAirship.addListener(EventType.NotificationOptInStatus, async (response) => {
    const isSystemPushEnabled = response.optIn;
    const registerDetails = await getRegisterDeviceDetails();

    if (registerDetails && isLoggedIn) {
      const { applicationTypeId, deviceId, deviceOptions } = registerDetails;

      dispatchRegisterDevice(applicationTypeId, deviceId, {
        ...deviceOptions,
        notificationPreferences: { globalNotifications: isSystemPushEnabled },
      });
    }
  });
};

export const removeNotificationOptinListener = (): void => {
  UrbanAirship.removeListener(EventType.NotificationOptInStatus, () => {});
};
