import * as React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { act } from "react-test-renderer";
import { Platform } from "react-native";
import { navigateWithThirdPartyScreenName, ScreenName, navigateWithDeepLinking } from "@ppb/tbd-router/native";
import OTPublishersNativeSDK from "react-native-onetrust-cmp";

const mockLogin = jest.fn();
jest.mock("@flutter-global/react-native-cet-framework", () => ({
  useLogin: jest.fn(() => mockLogin),
  CetContext: require("react").createContext({}),
}));

import ConnectedGamesPage from "../../GamingPage";
import GamingScreen from "./GamingScreen.native";

const mockSetState = jest.fn();

const mockAddListener = jest.fn().mockReturnValue({ remove: jest.fn() });
jest.mock("react-native", () => {
  const { StyleSheet, Text, View } = jest.requireActual("react-native");
  return {
    NativeEventEmitter: () => ({
      addListener: mockAddListener,
    }),
    NativeModules: {
      GamesLobbyEventEmitter: jest.fn(),
    },
    Platform: {},
    requireNativeComponent: jest.fn(),
    StyleSheet,
    Text,
    View,
  };
});

jest.mock("../../../helpers/gaming.native", () => ({
  getValidGameLaunchPatterns: jest.fn(() => [/launcher\.rebuild(\.\w+)+/, /newLauncher\.rebuild(\.\w+)+/]),
}));

const mockUseRoute = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useRoute: () => mockUseRoute,
  useFocusEffect: () => jest.fn(),
  useTheme: () => ({
    colors: {
      text: "#fff",
    },
  }),
  DarkTheme: {
    colors: {
      text: "#fff",
    },
  },
}));

jest.mock("../../../helpers/cookies.native", () => ({
  CATEGORIES: {
    PERFORMANCE: "C0002",
  },
}));

jest.mock("@ppb/tbd-shared/components/GamingPage", () => ({
  __esModule: true,
  default: jest.fn(() => <connected-gaming-page />),
}));

jest.mock("@ppb/tbd-shared/components/GamingPage/GamingPage.ios", () => ({
  __esModule: true,
  default: "GamingPageIosMock",
}));

const APP_CONFIG_MOCKS = {
  APP_KEYS: {
    ios: "mocked_key",
  },
};

jest.mock("../../../config/app-configuration.native.ts", () => ({ appConfig: APP_CONFIG_MOCKS }));

jest.mock("react-native-onetrust-cmp", () => ({
  showPreferenceCenterUI: jest.fn(),
  getOTConsentJSForWebView: jest.fn().mockResolvedValue("var OTExternalConsent = {this is content}"),
  getConsentStatusForCategory: jest.fn(() => Promise.resolve("1")),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigateWithThirdPartyScreenName: jest.fn(),
  navigate: jest.fn(),
  navigateWithDeepLinking: jest.fn(),
  ScreenName: {
    GamingLobbyScreen: "GamingLobbyScreen",
    GamingGamesCollectionScreen: "GamingGamesCollectionScreen",
    GamingMySelectionsScreen: "GamingMySelectionsScreen",
    GamingWebViewScreen: "GamingWebViewScreen",
  },
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: {},
  spacings: {},
  colors: {},
  typography: {},
  stackings: {},
  tokens: {},
}));

jest.mock("../../BackNavigationItem", () => "ConnectedBackNavigationItem");

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderScreen(cetValue = {}, gamingValue = {}) {
  const CetContext = require("@flutter-global/react-native-cet-framework").CetContext;
  const GamingContext = require("../../GamingPage/GamingContext").default;
  return render(
    <GamingContext.Provider
      value={{ setDeepLinkUrn: () => {}, setDeepLinkUrl: () => {}, setRecentlyPlayedUrn: () => {}, ...gamingValue }}
    >
      <CetContext.Provider
        value={{
          isAuthenticated: false,
          authorizationToken: undefined,
          gameInfo: undefined,
          logOut: () => {},
          setGameInfo: () => {},
          useLogin: () => {},
          ...cetValue,
        }}
      >
        <GamingScreen />
      </CetContext.Provider>
    </GamingContext.Provider>,
  );
}
const handleCurrentRoute = jest.fn();
function renderGamesPage() {
  const configs = {
    ssoId: undefined,
    loggedIn: undefined,
    applicationKey: "mocked_key",
    performanceCookiesStatus: true,
    screen: "mockConstructor",
    gameLaunchInfo: true,
  };
  return render(
    <ConnectedGamesPage handleCurrentRoute={handleCurrentRoute} configs={configs} component="GamingPageIosMock" />,
  );
}

function mockGetConnectedGamesPageCallWith(predicate) {
  return ConnectedGamesPage.mock.calls.some(([props]) => {
    try {
      return predicate(props);
    } catch (e) {
      return false;
    }
  });
}

describe("GamingScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when platform is android", () => {
    let androidPlaceholderText;

    beforeEach(() => {
      Platform.OS = "android";
      const { queryByText } = renderScreen();
      androidPlaceholderText = queryByText("Gaming Screen Placeholder");
    });
    it("should generate the necessary translations", () => {
      expect(androidPlaceholderText).toHaveTextContent("Gaming Screen Placeholder");
    });
  });

  describe("when platform is ios", () => {
    beforeAll(() => {
      Platform.OS = "ios";
    });

    it("should render the component with the correct props", () => {
      renderGamesPage();
      expect(ConnectedGamesPage).toHaveBeenCalledWith(
        {
          handleCurrentRoute,
          configs: {
            ssoId: undefined,
            loggedIn: undefined,
            applicationKey: "mocked_key",
            performanceCookiesStatus: true,
            screen: "mockConstructor",
            gameLaunchInfo: true,
          },
          component: "GamingPageIosMock",
        },
        undefined,
      );
      expect(ConnectedGamesPage).toHaveBeenCalled();
    });

    it("should add all native listener", () => {
      renderScreen();
      expect(mockAddListener).toHaveBeenCalledTimes(10);
    });

    it("should retrive consent from one trust", async () => {
      OTPublishersNativeSDK.getOTConsentJSForWebView.mockResolvedValue("CONSENTDATA");
      renderScreen();
      await waitFor(() => {
        expect(OTPublishersNativeSDK.getOTConsentJSForWebView).toHaveBeenCalled();
      });
    });

    describe("when event handler is called", () => {
      describe("when onSSOIDRequired is called", () => {
        describe("and authorizationToken is undefined", () => {
          describe("and isAuthenticated is false", () => {
            it("should not call login", async () => {
              renderScreen({ authorizationToken: undefined, isAuthenticated: false });
              const onSSOIDCalls = mockAddListener.mock.calls.filter((c) => c[0] === "onSSOIDRequired");
              const onSSOIDCall = onSSOIDCalls[onSSOIDCalls.length - 1];
              await onSSOIDCall[1]();
              expect(mockLogin).not.toHaveBeenCalled();
            });
          });
        });

        describe("and authorizationToken is not undefined", () => {
          describe("and isAuthenticated is false", () => {
            it("should call login", async () => {
              renderScreen({ authorizationToken: "fake-token", isAuthenticated: false });
              const onSSOIDCalls = mockAddListener.mock.calls.filter((c) => c[0] === "onSSOIDRequired");
              const onSSOIDCall = onSSOIDCalls[onSSOIDCalls.length - 1];
              expect(onSSOIDCall).toBeDefined();
              expect(typeof onSSOIDCall[1]).toBe("function");
              await act(async () => {
                await onSSOIDCall[1]();
              });
              expect(mockLogin).toHaveBeenCalled();
            });
          });
          describe("and isAuthenticated is true", () => {
            it("should not call login", async () => {
              renderScreen({ authorizationToken: "fake-token", isAuthenticated: true });
              const onSSOIDCalls = mockAddListener.mock.calls.filter((c) => c[0] === "onSSOIDRequired");
              const onSSOIDCall = onSSOIDCalls[onSSOIDCalls.length - 1];
              expect(onSSOIDCall).toBeDefined();
              expect(typeof onSSOIDCall[1]).toBe("function");
              await act(async () => {
                await onSSOIDCall[1]();
              });
              expect(mockLogin).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe("when onNeedsAppLogout is called", () => {
        it("should call logOut", async () => {
          const mockLogOut = jest.fn();
          renderScreen({ logOut: mockLogOut });
          const onNeedsAppLogoutCalls = mockAddListener.mock.calls.filter((c) => c[0] === "onNeedsAppLogout");
          const onNeedsAppLogoutCall = onNeedsAppLogoutCalls[onNeedsAppLogoutCalls.length - 1];
          await act(async () => {
            await onNeedsAppLogoutCall[1]();
          });
          expect(mockLogOut).toHaveBeenCalled();
        });
      });

      describe("when onShowWebView is called", () => {
        it("should navigate to GamingWebViewScreen", async () => {
          renderScreen();
          const onShowWebViewCalls = mockAddListener.mock.calls.filter((c) => c[0] === "onShowWebView");
          const onShowWebViewCall = onShowWebViewCalls[onShowWebViewCalls.length - 1];
          await act(async () => {
            await onShowWebViewCall[1]();
          });
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalled();
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GamingWebViewScreen, {
            params: { backNavigationTitle: "", showBackButton: false, isSuperSpinsUrl: false },
          });
        });
      });

      describe("when onDismissGameContainer is called", () => {
        it("should navigate to GamingWebViewScreen", async () => {
          const mockSetGameInfo = jest.fn();
          renderScreen({ setGameInfo: mockSetGameInfo });
          const onDismissGameContainerCalls = mockAddListener.mock.calls.filter(
            (c) => c[0] === "onDismissGameContainer",
          );
          const onDismissGameContainerCall = onDismissGameContainerCalls[onDismissGameContainerCalls.length - 1];
          await act(async () => {
            await onDismissGameContainerCall[1]();
          });
          expect(mockSetGameInfo).toHaveBeenCalled();
          expect(mockSetGameInfo).toHaveBeenCalledWith(null);
        });
      });

      describe("when onOpenSubGameCollectionScreen is called", () => {
        it("should navigate to SubGamingGamesCollectionScreen", async () => {
          renderScreen();
          const onOpenSubGameCollectionScreenCalls = mockAddListener.mock.calls.filter(
            (c) => c[0] === "onOpenSubGameCollectionScreen",
          );
          const onOpenSubGameCollectionScreenCall =
            onOpenSubGameCollectionScreenCalls[onOpenSubGameCollectionScreenCalls.length - 1];
          await act(async () => {
            await onOpenSubGameCollectionScreenCall[1]();
          });
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalled();
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GamingSubGamesCollectionScreen);
        });
      });

      describe("when onOpenGameCollectionScreen is called", () => {
        it("should navigate to GamingGamesCollectionScreen with correct params", async () => {
          renderScreen();
          const onOpenGameCollectionScreenCalls = mockAddListener.mock.calls.filter(
            (c) => c[0] === "onOpenGameCollectionScreen",
          );
          const onOpenGameCollectionScreenCall =
            onOpenGameCollectionScreenCalls[onOpenGameCollectionScreenCalls.length - 1];
          await act(async () => {
            await onOpenGameCollectionScreenCall[1]({ backNavigationTitle: "Test Title" });
          });
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledTimes(1);
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GamingGamesCollectionScreen, {
            params: {
              showBackButton: true,
              backNavigationTitle: "Test Title",
            },
          });
        });

        it("should provide default values if backNavigationTitle is missing", async () => {
          renderScreen();
          const onOpenGameCollectionScreenCalls = mockAddListener.mock.calls.filter(
            (c) => c[0] === "onOpenGameCollectionScreen",
          );
          const onOpenGameCollectionScreenCall =
            onOpenGameCollectionScreenCalls[onOpenGameCollectionScreenCalls.length - 1];
          await act(async () => {
            await onOpenGameCollectionScreenCall[1]({});
          });
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledTimes(1);
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GamingGamesCollectionScreen);
        });
      });

      describe("when onOpenMySelectionsScreen is called", () => {
        it("should navigate to GamingMySelectionsScreen", async () => {
          renderScreen();
          const onOpenMySelectionsScreenCalls = mockAddListener.mock.calls.filter(
            (c) => c[0] === "onOpenMySelectionsScreen",
          );
          const onOpenMySelectionsScreenCall = onOpenMySelectionsScreenCalls[onOpenMySelectionsScreenCalls.length - 1];
          await act(async () => {
            await onOpenMySelectionsScreenCall[1]();
          });
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalled();
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GamingMySelectionsScreen);
        });
      });

      describe("when onDismissMySelectionsScreen is called with gaming route", () => {
        it("should navigate to GamingLobbyScreen", async () => {
          jest.spyOn(React, "useState").mockImplementation(() => [null, mockSetState]);
          renderScreen();
          const onDismissMySelectionsScreenCalls = mockAddListener.mock.calls.filter(
            (c) => c[0] === "onDismissMySelectionsScreen",
          );
          const onDismissMySelectionsScreenCall =
            onDismissMySelectionsScreenCalls[onDismissMySelectionsScreenCalls.length - 1];
          await act(async () => {
            await onDismissMySelectionsScreenCall[1]();
          });
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalled();
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GamingLobbyScreen);
        });
      });

      describe("when onOpenPreferenceCenter is called", () => {
        it("should call showPreferenceCenter", async () => {
          renderScreen();
          const onOpenPreferenceCenterCalls = mockAddListener.mock.calls.filter(
            (c) => c[0] === "onOpenPreferenceCenter",
          );
          const onOpenPreferenceCenterCall = onOpenPreferenceCenterCalls[onOpenPreferenceCenterCalls.length - 1];
          await act(async () => {
            await onOpenPreferenceCenterCall[1]();
          });
          expect(OTPublishersNativeSDK.showPreferenceCenterUI).toHaveBeenCalled();
        });
      });
    });

    describe("when onGoToHomeTabScreen is called with gaming route", () => {
      it("should navigate to HomeTab", async () => {
        renderScreen();
        const onGoToHomeTabScreenCalls = mockAddListener.mock.calls.filter((c) => c[0] === "onGoToHomeTabScreen");
        const onGoToHomeTabScreenCall = onGoToHomeTabScreenCalls[onGoToHomeTabScreenCalls.length - 1];
        await act(async () => {
          await onGoToHomeTabScreenCall[1]({
            urlDeepLinking: {
              urlDeepLinking: "www.betfair.com",
            },
          });
        });
        expect(navigateWithDeepLinking).toHaveBeenCalled();
      });
    });

    describe("when gameInfo has a value", () => {
      it("should set state for gameLaunchInfo", async () => {
        renderScreen({ gameInfo: "mocked game info" });
        await waitFor(() => {
          const found = mockGetConnectedGamesPageCallWith(
            (call) => call?.configs?.gameLaunchInfo === "mocked game info",
          );
          expect(found).toBeTruthy();
        });
      });

      it("should set state for performanceCookiesStatus", async () => {
        renderScreen();
        await waitFor(() => {
          const found = mockGetConnectedGamesPageCallWith((call) => call?.configs?.performanceCookiesStatus !== -1);
          expect(found).toBeTruthy();
        });
      });
    });
  });
});
