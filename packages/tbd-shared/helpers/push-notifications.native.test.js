/* eslint-disable no-undef */
import { UrbanAirship } from "urbanairship-react-native";
import { Platform } from "react-native";
import { MobileCore } from "@adobe/react-native-aepcore";
import * as pushNotificationsHelper from "./push-notifications.native";
import Storage from "./storage.native";

jest.mock("react-native-device-info", () => ({
  getBuildNumber: () => 7000,
}));

jest.mock("react-native", () => ({
  NativeModules: {
    AirshipConfigModule: {
      getAppKey: () => Promise.resolve("fakeAppKey"),
    },
  },
  Platform: {
    OS: "iOS",
  },
}));

jest.mock("urbanairship-react-native", () => ({
  UrbanAirship: {
    enableUserPushNotifications: jest.fn(),
    getChannelId: jest.fn().mockResolvedValue("channelId"),
    getRegistrationToken: jest.fn().mockResolvedValue("registrationToken"),
    isSystemNotificationsEnabledForApp: jest.fn().mockResolvedValue("isSystemNotificationsEnabledForApp"),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    setUserNotificationsEnabled: jest.fn(),
    getNotificationStatus: jest.fn().mockResolvedValue("getNotificationStatus"),
  },
  EventType: {
    NotificationOptInStatus: "NotificationOptInStatus",
  },
  iOS: {
    AuthorizedNotificationStatus: {
      Authorized: "authorized",
      NotDetermined: "notDetermined",
    },
  },
}));

jest.mock("../config/app-configuration.native.ts", () => ({
  appConfig: {
    ADOBE_APP_KEYS: {
      ios: {
        dev: "iosAdobeDevKey",
        prod: "iosAdobeProdKey",
      },
      android: {
        dev: "androidAdobeDevKey",
        prod: "androidAdobeProdKey",
      },
    },
  },
}));

jest.mock("@adobe/react-native-aepcore", () => ({
  MobileCore: { updateConfiguration: jest.fn() },
}));

jest.mock("@ppb/tbd-shared/config/endpoints", () => ({
  getAdobeSdkConfig: jest.fn(() => ({
    ADOBE_TRACKING_SERVER: "ADOBE_TRACKING_SERVER",
    ADOBE_MARKETING_SERVER: "ADOBE_MARKETING_SERVER",
  })),
}));

jest.mock("./storage.native", () => ({ setItem: jest.fn(), getItem: jest.fn().mockResolvedValue("getItem") }));

describe("Push Notifications Helper", () => {
  afterEach(jest.clearAllMocks);

  describe("showNativePushPrompt", () => {
    it("should call UA enableUserPushNotifications method", async () => {
      await pushNotificationsHelper.showNativePushPrompt(() => {});

      expect(UrbanAirship.enableUserPushNotifications).toHaveBeenCalledTimes(1);
    });

    it("should call Storage setItem method", async () => {
      await pushNotificationsHelper.showNativePushPrompt(() => {});

      expect(Storage.setItem).toHaveBeenLastCalledWith("wasNotificationNativePromptShown", true);
    });

    it("should dispatch an native prompt shown action", async () => {
      const dispatchNativePromptShown = jest.fn();
      await pushNotificationsHelper.showNativePushPrompt(dispatchNativePromptShown);

      expect(dispatchNativePromptShown).toHaveBeenCalledTimes(1);
    });
  });

  describe("getRegisterDeviceDetails", () => {
    it("should get ua channelId", async () => {
      await pushNotificationsHelper.getRegisterDeviceDetails();

      expect(UrbanAirship.getChannelId).toHaveBeenCalled();
    });

    it("should get ua registrationToken", async () => {
      await pushNotificationsHelper.getRegisterDeviceDetails();

      expect(UrbanAirship.getRegistrationToken).toHaveBeenCalled();
    });

    it("should get system notifications status", async () => {
      await pushNotificationsHelper.getRegisterDeviceDetails();

      expect(UrbanAirship.isSystemNotificationsEnabledForApp).toHaveBeenCalled();
    });

    describe("when is ANDROID", () => {
      beforeEach(() => {
        Platform.OS = "android";
      });

      it("should return the device details", async () => {
        const deviceDetails = await pushNotificationsHelper.getRegisterDeviceDetails();

        expect(deviceDetails).toStrictEqual({
          applicationTypeId: "fakeAppKey",
          deviceId: "channelId",
          deviceOptions: {
            deviceDetails: { deviceToken: "registrationToken", platform: "ANDROID", uaChannelId: "channelId" },
            notificationPreferences: { globalNotifications: "isSystemNotificationsEnabledForApp" },
            applicationDetails: { version: 7000 },
          },
        });
      });

      describe("when is PROD", () => {
        it("should register with productionAppKey", async () => {
          __DEV__ = false;
          const deviceDetails = await pushNotificationsHelper.getRegisterDeviceDetails();

          expect(deviceDetails).toStrictEqual({
            applicationTypeId: "fakeAppKey",
            deviceId: "channelId",
            deviceOptions: {
              deviceDetails: { deviceToken: "registrationToken", platform: "ANDROID", uaChannelId: "channelId" },
              notificationPreferences: { globalNotifications: "isSystemNotificationsEnabledForApp" },
              applicationDetails: { version: 7000 },
            },
          });
        });

        it("should register adobe sdk with productionAppKey", async () => {
          __DEV__ = false;
          await pushNotificationsHelper.getRegisterDeviceDetails();

          expect(MobileCore.updateConfiguration).toHaveBeenCalledWith({
            "build.environment": "prod",
            "campaignclassic.ios.integrationKey": "iosAdobeProdKey",
            "campaignclassic.android.integrationKey": "androidAdobeProdKey",
            "campaignclassic.trackingServer": "ADOBE_TRACKING_SERVER",
            "campaignclassic.marketingServer": "ADOBE_MARKETING_SERVER",
            "global.privacy": "optedin",
          });
        });
      });

      describe("when is DEV", () => {
        it("should register with developmentAppKey", async () => {
          __DEV__ = true;
          const deviceDetails = await pushNotificationsHelper.getRegisterDeviceDetails();

          expect(deviceDetails).toStrictEqual({
            applicationTypeId: "fakeAppKey",
            deviceId: "channelId",
            deviceOptions: {
              deviceDetails: { deviceToken: "registrationToken", platform: "ANDROID", uaChannelId: "channelId" },
              notificationPreferences: { globalNotifications: "isSystemNotificationsEnabledForApp" },
              applicationDetails: { version: 7000 },
            },
          });
        });
      });

      it("should register adobe sdk with productionAppKey", async () => {
        __DEV__ = true;
        await pushNotificationsHelper.getRegisterDeviceDetails();

        expect(MobileCore.updateConfiguration).toHaveBeenCalledWith({
          "build.environment": "dev",
          "campaignclassic.ios.integrationKey": "iosAdobeDevKey",
          "campaignclassic.android.integrationKey": "androidAdobeDevKey",
          "campaignclassic.trackingServer": "ADOBE_TRACKING_SERVER",
          "campaignclassic.marketingServer": "ADOBE_MARKETING_SERVER",
          "global.privacy": "optedin",
        });
      });
    });

    describe("when is IOS", () => {
      beforeEach(() => {
        Platform.OS = "ios";
      });

      it("should register device with the urban airship registrationToken", async () => {
        const deviceDetails = await pushNotificationsHelper.getRegisterDeviceDetails();

        expect(deviceDetails).toStrictEqual({
          applicationTypeId: "fakeAppKey",
          deviceId: "registrationToken",
          deviceOptions: {
            deviceDetails: { deviceToken: "registrationToken", platform: "IOS", uaChannelId: "channelId" },
            notificationPreferences: { globalNotifications: "isSystemNotificationsEnabledForApp" },
            applicationDetails: { version: 7000 },
          },
        });
      });

      describe("when is PROD", () => {
        it("should register adobe sdk with productionAppKey", async () => {
          __DEV__ = false;
          await pushNotificationsHelper.getRegisterDeviceDetails();

          expect(MobileCore.updateConfiguration).toHaveBeenCalledWith({
            "build.environment": "prod",
            "campaignclassic.ios.integrationKey": "iosAdobeProdKey",
            "campaignclassic.android.integrationKey": "androidAdobeProdKey",
            "campaignclassic.trackingServer": "ADOBE_TRACKING_SERVER",
            "campaignclassic.marketingServer": "ADOBE_MARKETING_SERVER",
            "global.privacy": "optedin",
          });
        });
      });

      describe("when is DEV", () => {
        it("should register adobe sdk with productionAppKey", async () => {
          __DEV__ = true;
          await pushNotificationsHelper.getRegisterDeviceDetails();

          expect(MobileCore.updateConfiguration).toHaveBeenCalledWith({
            "build.environment": "dev",
            "campaignclassic.ios.integrationKey": "iosAdobeDevKey",
            "campaignclassic.android.integrationKey": "androidAdobeDevKey",
            "campaignclassic.trackingServer": "ADOBE_TRACKING_SERVER",
            "campaignclassic.marketingServer": "ADOBE_MARKETING_SERVER",
            "global.privacy": "optedin",
          });
        });
      });
    });
  });

  describe("updateRegistration", () => {
    const dispatchRegisterDevice = jest.fn();

    describe("when in iOS", () => {
      describe("and already accepted/reject notifications outside the Notifications Promp", () => {
        beforeAll(() => {
          Platform.OS = "ios";
          Storage.getItem.mockResolvedValue(undefined);
          UrbanAirship.getNotificationStatus.mockResolvedValue({ ios: { authorizedStatus: "authorized" } });
        });

        it("should set wasNotificationsPromptShown to true", async () => {
          await pushNotificationsHelper.updateRegistration(false, dispatchRegisterDevice);

          expect(Storage.setItem).toHaveBeenCalledWith("wasNotificationsPromptShown", true);
        });
      });

      describe("and already accepted notifications", () => {
        beforeAll(() => {
          Platform.OS = "ios";
          UrbanAirship.getNotificationStatus.mockResolvedValue({ ios: { authorizedStatus: "authorized" } });
        });

        describe("and registerDetails is defined", () => {
          beforeAll(async () => {
            UrbanAirship.getChannelId.mockResolvedValue("registrationToken");
            await pushNotificationsHelper.updateRegistration(true, dispatchRegisterDevice);
          });

          it("should call dispatchRegisterDevice", () => {
            expect(dispatchRegisterDevice).toHaveBeenCalledWith("fakeAppKey", "registrationToken", {
              deviceDetails: { deviceToken: "registrationToken", platform: "IOS", uaChannelId: "registrationToken" },
              notificationPreferences: { globalNotifications: "isSystemNotificationsEnabledForApp" },
              applicationDetails: { version: 7000 },
            });
          });
        });

        describe("and registerDetails is not defined", () => {
          beforeAll(async () => {
            UrbanAirship.getChannelId.mockResolvedValue(null);

            await pushNotificationsHelper.updateRegistration(true, dispatchRegisterDevice);
          });

          it("should not call dispatchRegisterDevice", () => {
            expect(dispatchRegisterDevice).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe("when in android", () => {
      beforeAll(() => {
        Platform.OS = "android";
        UrbanAirship.isSystemNotificationsEnabledForApp.mockResolvedValue(false);
      });

      it("should call UA isSystemNotificationsEnabledForApp twice", async () => {
        await pushNotificationsHelper.updateRegistration(true, dispatchRegisterDevice);

        expect(UrbanAirship.isSystemNotificationsEnabledForApp).toHaveBeenCalledTimes(2);
      });

      it("should call UA setUserNotificationsEnabled", async () => {
        await pushNotificationsHelper.updateRegistration(true, dispatchRegisterDevice);

        expect(UrbanAirship.setUserNotificationsEnabled).toHaveBeenCalledWith(false);
      });

      describe("and registerDetails is defined", () => {
        beforeAll(async () => {
          Platform.OS = "android";
          UrbanAirship.isSystemNotificationsEnabledForApp.mockResolvedValue("isSystemNotificationsEnabledForApp");
          UrbanAirship.getChannelId.mockResolvedValue("channelId");
          await pushNotificationsHelper.updateRegistration(true, dispatchRegisterDevice);
        });

        it("should call dispatchRegisterDevice", () => {
          expect(dispatchRegisterDevice).toHaveBeenCalledWith("fakeAppKey", "channelId", {
            deviceDetails: { deviceToken: "registrationToken", platform: "ANDROID", uaChannelId: "channelId" },
            notificationPreferences: { globalNotifications: "isSystemNotificationsEnabledForApp" },
            applicationDetails: { version: 7000 },
          });
        });
      });

      describe("and registerDetails is not defined", () => {
        beforeAll(async () => {
          Platform.OS = "android";
          UrbanAirship.isSystemNotificationsEnabledForApp.mockResolvedValue(false);
          UrbanAirship.getChannelId.mockResolvedValue(null);

          await pushNotificationsHelper.updateRegistration(true, dispatchRegisterDevice);
        });

        it("should not call dispatchRegisterDevice", () => {
          expect(dispatchRegisterDevice).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("registerNotificationOptinListener", () => {
    const dispatchRegisterDevice = jest.fn();

    it("should call UA addListener", async () => {
      await pushNotificationsHelper.registerNotificationOptinListener(false, dispatchRegisterDevice);

      expect(UrbanAirship.addListener).toHaveBeenCalledWith("NotificationOptInStatus", expect.any(Function));
    });

    describe("when registerDetails is defined and user is logged in", () => {
      beforeAll(async () => {
        UrbanAirship.getChannelId.mockResolvedValue("registrationToken");
        await pushNotificationsHelper.registerNotificationOptinListener(true, dispatchRegisterDevice);

        await UrbanAirship.addListener.mock.calls[0][1]({ optIn: true });
      });

      it("should call dispatch", async () => {
        expect(dispatchRegisterDevice).toHaveBeenCalledWith("fakeAppKey", "registrationToken", {
          deviceDetails: { deviceToken: "registrationToken", platform: "ANDROID", uaChannelId: "registrationToken" },
          notificationPreferences: { globalNotifications: true },
          applicationDetails: { version: 7000 },
        });
      });
    });

    describe("when registerDetails is defined but user is not logged in", () => {
      beforeAll(async () => {
        UrbanAirship.getChannelId.mockResolvedValue("registrationToken");
        await pushNotificationsHelper.registerNotificationOptinListener(false, dispatchRegisterDevice);

        await UrbanAirship.addListener.mock.calls[0][1]({ optIn: true });
      });

      it("should not call dispatch", async () => {
        expect(dispatchRegisterDevice).not.toHaveBeenCalled();
      });
    });

    describe("when registerDetails is not defined and user is logged in", () => {
      beforeAll(async () => {
        UrbanAirship.getChannelId.mockResolvedValue(null);

        await pushNotificationsHelper.registerNotificationOptinListener(true, dispatchRegisterDevice);

        await UrbanAirship.addListener.mock.calls[0][1]({ optIn: true });
      });

      it("should call dispatch", async () => {
        expect(dispatchRegisterDevice).not.toHaveBeenCalled();
      });
    });

    describe("when registerDetails is not defined but user is not logged in", () => {
      beforeAll(async () => {
        UrbanAirship.getChannelId.mockResolvedValue(null);

        await pushNotificationsHelper.registerNotificationOptinListener(false, dispatchRegisterDevice);

        await UrbanAirship.addListener.mock.calls[0][1]({ optIn: true });
      });

      it("should call dispatch", async () => {
        expect(dispatchRegisterDevice).not.toHaveBeenCalled();
      });
    });
  });

  describe("removeNotificationOptinListener", () => {
    it("should call UA addListener", () => {
      pushNotificationsHelper.removeNotificationOptinListener();

      expect(UrbanAirship.removeListener).toHaveBeenCalled();
    });
  });
});
