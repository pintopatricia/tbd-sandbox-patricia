import { render, waitFor, act } from "@testing-library/react-native";
import { DeviceEventEmitter, Platform } from "react-native";
import { NotificationPrompt } from "@ppb/the-wall-native";
import Storage from "../../helpers/storage.native";
import {
  updateRegistration,
  showNativePushPrompt,
  registerNotificationOptinListener,
  removeNotificationOptinListener,
  retrieveSystemNotificationStatus,
} from "../../helpers/push-notifications.native";
import NotificationsInitialPrompt from "./NotificationsInitialPrompt.native";
import { showCookieConsentBannerAfterDelay } from "../../cookie-consent/cookie-consent.native";

const mockUseJoinNow = jest.fn();
const mockUseLogin = jest.fn();

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
    Version: 33,
  },
  DeviceEventEmitter: {
    addListener: jest.fn(),
    emit: jest.fn(),
  },
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  useLogin: () => mockUseLogin,
  useJoinNow: () => mockUseJoinNow,
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon {...props} />),
}));
jest.mock("@ppb/the-wall-native", () => ({
  NotificationPrompt: jest.fn(() => <notification-prompt />),
}));
jest.mock("../../helpers/storage.native", () => ({
  getItem: jest.fn(() => Promise.resolve(undefined)),
  setItem: jest.fn(),
}));
jest.mock("../../helpers/push-notifications.native", () => ({
  showNativePushPrompt: jest.fn(() => Promise.resolve(true)),
  updateRegistration: jest.fn(),
  registerNotificationOptinListener: jest.fn(),
  removeNotificationOptinListener: jest.fn(),
  retrieveSystemNotificationStatus: jest.fn(() => Promise.resolve(undefined)),
}));

jest.mock("../../cookie-consent/cookie-consent.native", () => ({
  showCookieConsentBannerAfterDelay: jest.fn(),
}));

jest.mock("../../config/app-configuration.native", () => ({
  appBrand: "betfair",
}));

jest.mock("./useIsReadyToShow.native", () => ({
  useIsReadyToShow: jest.fn(() => true),
}));

function renderNotificationsInitialPrompt({
  isLoggedIn = true,
  titleLabel = "title",
  descriptionLabel = "description",
  acceptLabel = "accept",
  rejectLabel = "reject",
  dispatchRegisterDevice = () => {},
  dispatchNativePromptShown = () => {},
  dispatchPushNotificationEvent = () => {},
}) {
  return render(
    <NotificationsInitialPrompt
      isLoggedIn={isLoggedIn}
      titleLabel={titleLabel}
      descriptionLabel={descriptionLabel}
      acceptLabel={acceptLabel}
      rejectLabel={rejectLabel}
      dispatchRegisterDevice={dispatchRegisterDevice}
      dispatchNativePromptShown={dispatchNativePromptShown}
      dispatchPushNotificationEvent={dispatchPushNotificationEvent}
    />,
  );
}

describe("NotificationsInitialPrompt", () => {
  beforeEach(jest.clearAllMocks);

  describe("updateRegistration", () => {
    const dispatchRegisterDevice = jest.fn();

    beforeEach(() => {
      renderNotificationsInitialPrompt({ isLoggedIn: false, dispatchRegisterDevice });
    });

    it("should be called with correct arguments", () => {
      expect(updateRegistration).toHaveBeenLastCalledWith(false, dispatchRegisterDevice);
    });
  });

  describe("registerNotificationOptinListener", () => {
    const dispatchRegisterDevice = jest.fn();

    beforeEach(() => {
      renderNotificationsInitialPrompt({ isLoggedIn: false, dispatchRegisterDevice });
    });

    it("should be called with correct arguments", () => {
      expect(registerNotificationOptinListener).toHaveBeenLastCalledWith(false, dispatchRegisterDevice);
    });
  });

  describe("retrieveSystemNotificationStatus", () => {
    const dispatchRegisterDevice = jest.fn();

    beforeEach(() => {
      renderNotificationsInitialPrompt({ isLoggedIn: false, dispatchRegisterDevice });
    });

    it("should be called once", () => {
      expect(retrieveSystemNotificationStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe("when the user is not loggedin", () => {
    beforeEach(() => {
      renderNotificationsInitialPrompt({ isLoggedIn: false });
    });

    it("shouldn't call NotificationPrompt", () => {
      expect(NotificationPrompt).not.toHaveBeenCalled();
    });
  });

  describe("when the user is loggedin", () => {
    describe("and it doesn't have the wasNotificationsPromptShown flag in the storage", () => {
      describe("and when platform is android and SDK version equals or higher than 33", () => {
        it("should call NotificationPrompt", async () => {
          renderNotificationsInitialPrompt({ isLoggedIn: true });
          await waitFor(() => expect(DeviceEventEmitter.addListener).toHaveBeenCalled());
          act(() => {
            const onFinishSetupBiometricListener = DeviceEventEmitter.addListener.mock.calls[0][1];
            onFinishSetupBiometricListener();
          });

          expect(NotificationPrompt).toHaveBeenCalledWith(
            {
              description: "description",
              onCloseTap: expect.any(Function),
              onPrimaryButtonTap: expect.any(Function),
              onSecondaryButtonTap: expect.any(Function),
              primaryButtonLabel: "accept",
              secondaryButtonLabel: "reject",
              title: "title",
            },
            undefined,
          );
        });
      });

      describe("and when platform is android and SDK version is lower than 33", () => {
        beforeEach(() => {
          Platform.Version = 31;
        });

        it("should not call NotificationPrompt", async () => {
          renderNotificationsInitialPrompt({ isLoggedIn: true });
          await waitFor(() => expect(retrieveSystemNotificationStatus).toHaveBeenCalled());
          expect(NotificationPrompt).not.toHaveBeenCalled();
        });
      });

      describe("and when platform is ios", () => {
        beforeEach(() => {
          Platform.OS = "ios";
        });
        it("should call NotificationPrompt", async () => {
          renderNotificationsInitialPrompt({ isLoggedIn: true });
          await waitFor(() => expect(DeviceEventEmitter.addListener).toHaveBeenCalled());
          act(() => {
            const onFinishSetupBiometricListener = DeviceEventEmitter.addListener.mock.calls[0][1];
            onFinishSetupBiometricListener();
          });
          expect(NotificationPrompt).toHaveBeenCalledWith(
            {
              description: "description",
              onCloseTap: expect.any(Function),
              onPrimaryButtonTap: expect.any(Function),
              onSecondaryButtonTap: expect.any(Function),
              primaryButtonLabel: "accept",
              secondaryButtonLabel: "reject",
              title: "title",
            },
            undefined,
          );
        });
      });

      describe("and if the user accepts the prompt", () => {
        const dispatchRegisterDevice = jest.fn();
        const dispatchPushNotificationEvent = jest.fn();
        const dispatchNativePromptShown = jest.fn();

        beforeEach(async () => {
          renderNotificationsInitialPrompt({
            isLoggedIn: true,
            dispatchRegisterDevice,
            dispatchPushNotificationEvent,
            dispatchNativePromptShown,
          });
          await waitFor(() => expect(DeviceEventEmitter.addListener).toHaveBeenCalled());
          act(() => {
            const onFinishSetupBiometricListener = DeviceEventEmitter.addListener.mock.calls[0][1];
            onFinishSetupBiometricListener();
          });
          const { onPrimaryButtonTap } = NotificationPrompt.mock.calls[0][0];
          await waitFor(() => onPrimaryButtonTap());
        });

        it("should call Storage setItem", () => {
          expect(Storage.setItem).toHaveBeenCalledWith("wasNotificationsPromptShown", true);
        });

        it("should call showNativePushPrompt", () => {
          expect(showNativePushPrompt).toHaveBeenCalledWith(dispatchNativePromptShown);
        });

        it("should call dispatchPushNotificationEvent with the device details", () => {
          expect(dispatchPushNotificationEvent).toHaveBeenCalledWith("accept", "notifications");
        });

        it("should not call the showCookieConsentBannerAfterDelay method", () => {
          expect(showCookieConsentBannerAfterDelay).not.toHaveBeenCalled();
        });
      });
    });

    describe("and it has the wasNotificationsPromptShown flag in the storage", () => {
      beforeEach(() => {
        Storage.getItem.mockResolvedValue(true);
      });

      it("shouldn't call NotificationPrompt", async () => {
        renderNotificationsInitialPrompt({ isLoggedIn: true });
        await waitFor(() => expect(retrieveSystemNotificationStatus).toHaveBeenCalled());

        expect(NotificationPrompt).not.toHaveBeenCalled();
      });
    });

    it("should call removeNotificationOptinListener on clean up", async () => {
      const { rerender } = renderNotificationsInitialPrompt({});

      rerender(
        <NotificationsInitialPrompt
          isLoggedIn={true}
          titleLabel={"title"}
          descriptionLabel={"description"}
          acceptLabel={"accept"}
          rejectLabel={"reject"}
        ></NotificationsInitialPrompt>,
      );

      expect(removeNotificationOptinListener).toHaveBeenCalled();
    });
  });
});
