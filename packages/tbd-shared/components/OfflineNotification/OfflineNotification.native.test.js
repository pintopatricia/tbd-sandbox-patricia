import { render, act } from "@testing-library/react-native";
import { Alert, AppState, Linking, Platform } from "react-native";
import { resetNavigationStack } from "@ppb/tbd-router/native";
import OfflineNotification from "./OfflineNotification.native";

const dispatchFetchAppContextMock = jest.fn();

jest.mock("@ppb/tbd-router/native", () => ({
  resetNavigationStack: jest.fn(),
}));

const renderOfflineNotification = async ({
  networkStatus = "ONLINE",
  currentUrn = undefined,
  i18nLabels = {
    text: "TEXT",
    title: "TITLE",
    retry: "RETRY",
    settings: "SETTINGS",
  },
  dispatchFetchAppContext = dispatchFetchAppContextMock,
  appContextBasePath = "base-path",
  bffEndpoint = "bff-endpoint",
  latestBffEndpoint = "bff-endpoint-latest",
  appEnv = "app-env",
}) => {
  const { rerender } = render(
    <OfflineNotification
      networkStatus={networkStatus}
      currentUrn={currentUrn}
      i18nLabels={i18nLabels}
      dispatchFetchAppContext={dispatchFetchAppContext}
      appContextBasePath={appContextBasePath}
      bffEndpoint={bffEndpoint}
      latestBffEndpoint={latestBffEndpoint}
      appEnv={appEnv}
    />,
  );

  return rerender;
};

describe("OfflineNotification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(Alert, "alert");
    jest.spyOn(global, "requestAnimationFrame");

    requestAnimationFrame.mockImplementation((cb) => cb());
  });

  describe("when the user is online", () => {
    it("shouldn't call Alert", async () => {
      AppState.currentState = "active";

      await renderOfflineNotification({ networkStatus: "ONLINE", currentUrn: "URN" });

      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  describe("when the user is offline", () => {
    describe("when the app is active (in foreground)", () => {
      it("should call alert with correct params", async () => {
        AppState.currentState = "active";

        await renderOfflineNotification({ networkStatus: "OFFLINE", currentUrn: "URN" });

        expect(Alert.alert).toHaveBeenCalledWith("TITLE", "TEXT", [
          { onPress: expect.any(Function), text: "SETTINGS" },
          { onPress: expect.any(Function), text: "RETRY" },
        ]);
      });

      describe("when pressing the Settings button", () => {
        describe("and the platform is ios", () => {
          it("should call Linking.openURL with correct params", async () => {
            Platform.OS = "ios";
            AppState.currentState = "active";

            await renderOfflineNotification({ networkStatus: "OFFLINE", currentUrn: "URN" });
            await act(async () => Alert.alert.mock.calls[0][2][0].onPress());

            expect(Linking.openURL).toHaveBeenLastCalledWith("App-prefs:");
          });
        });

        describe("and the platform is android", () => {
          it("should call Linking.sendIntent with correct params", async () => {
            Platform.OS = "android";
            AppState.currentState = "active";

            await renderOfflineNotification({ networkStatus: "OFFLINE", currentUrn: "URN" });
            await act(async () => Alert.alert.mock.calls[0][2][0].onPress());

            expect(Linking.sendIntent).toHaveBeenLastCalledWith("android.settings.SETTINGS");
          });
        });
      });
    });

    describe("when the app is not in active state (in background or other state besides native)", () => {
      it("should not call the alert", async () => {
        AppState.currentState = "background";
        await renderOfflineNotification({ networkStatus: "OFFLINE", currentUrn: "URN" });

        expect(Alert.alert).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the user is offline without a currentUrn (app boot)", () => {
    it("should call alert with correct params", async () => {
      AppState.currentState = "active";
      await renderOfflineNotification({ networkStatus: "OFFLINE", currentUrn: undefined });

      expect(Alert.alert).toHaveBeenCalledWith("TITLE", "TEXT", [
        { onPress: expect.any(Function), text: "SETTINGS" },
        { onPress: expect.any(Function), text: "RETRY" },
      ]);
    });

    describe("and the user is online again", () => {
      describe("and presses the Retry button", () => {
        it("should dispatch action to fetch app context", async () => {
          const updatedProps = {
            networkStatus: "ONLINE",
            i18nLabels: {
              text: "TEXT",
              title: "TITLE",
              retry: "RETRY",
              settings: "SETTINGS",
            },
            dispatchFetchAppContext: dispatchFetchAppContextMock,
            appContextBasePath: "base-path",
          };
          const rerender = await renderOfflineNotification({ networkStatus: "OFFLINE", currentUrn: undefined });

          rerender(<OfflineNotification {...updatedProps} />);
          await act(() => Alert.alert.mock.calls[0][2][1].onPress());

          expect(dispatchFetchAppContextMock).toHaveBeenCalledWith("bff-endpoint", "bff-endpoint-latest", "app-env");
          expect(dispatchFetchAppContextMock).toHaveBeenCalledTimes(1);
        });

        it("should call the resetNavigationStack function", async () => {
          const updatedProps = {
            networkStatus: "ONLINE",
            i18nLabels: {
              text: "TEXT",
              title: "TITLE",
              retry: "RETRY",
              settings: "SETTINGS",
            },
            dispatchFetchAppContext: dispatchFetchAppContextMock,
            appContextBasePath: "base-path",
          };
          const rerender = await renderOfflineNotification({ networkStatus: "OFFLINE", currentUrn: undefined });

          rerender(<OfflineNotification {...updatedProps} />);
          await act(() => Alert.alert.mock.calls[0][2][1].onPress());

          expect(resetNavigationStack).toHaveBeenCalled();
        });
      });
    });
  });
});
