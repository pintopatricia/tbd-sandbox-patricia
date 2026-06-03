import * as React from "react";
import { render, act } from "@testing-library/react-native";
import { BackHandler, DeviceEventEmitter, Platform } from "react-native";
import { useRoute } from "@react-navigation/native";
import { EVENTS, useLogin } from "@flutter-global/react-native-cet-framework";
import Orientation from "react-native-orientation-locker";
import { goBack } from "@ppb/tbd-router";
import { getStore } from "@ppb/tbd-store/create-store";
import NativeWebView from "./NativeWebView.native";
import RNCCustomWebView from "../../WebView/RNCCustomWebView";
import { forwardPYWMessages, sendWrapperEvent } from "../../../helpers/webview-event.native";
import GameLaunchScreen from "./GameLaunchScreen.native";
import { findRouteWithUrl } from "@ppb/tbd-routes";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(() => ({ current: false })),
  useContext: jest.fn(),
}));

jest.mock("../../../config/endpoints", () => ({
  getHost: jest.fn().mockReturnValue("betfair.com"),
  getHomepagePaths: jest.fn().mockReturnValue("betting|aaa|bbbb|dddd"),
}));

jest.mock("@ppb/tbd-routes", () => ({
  findRouteWithUrl: jest.fn(),
}));

jest.mock("../../../config/app-configuration.native", () => ({
  deeplinkConfiguration: {
    newGameLaunchPattern: /^https:\/\/([a-zA-Z0-9-]+\.)?betfair\.com(\.\w+)*\/gaming-launcher\/play\/?\?gameId=[^&]+/,
  },
}));

jest.mock("react-native", () => {
  const { StyleSheet, Text, View } = jest.requireActual("react-native");

  return {
    BackHandler: {
      addEventListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
    },
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter: {
      addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
    },
    Platform: {
      OS: "android",
    },
    useWindowDimensions: jest.fn(() => ({ width: 400, height: 800 })),
  };
});

jest.mock("./NativeWebView.native", () => jest.fn(() => <native-web-view-mock />));

const mockCetContext = React.createContext();
jest.mock("@flutter-global/react-native-cet-framework", () => ({
  CetContext: mockCetContext,
  useLogin: jest.fn(),
  EVENTS: {
    ON_LOGIN_CLOSED: "ON_LOGIN_CLOSED",
  },
}));

jest.mock("react-native-orientation-locker", () => ({
  getInitialOrientation: jest.fn(),
  unlockAllOrientations: jest.fn(),
  lockToPortrait: jest.fn(),
  lockToLandscape: jest.fn(),
}));

const viewUrlMock = "";
const mockUrn = "urn";

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(() => ({
    params: {
      viewLink: {
        viewUrl: viewUrlMock,
      },
      params: {
        urn: mockUrn,
      },
    },
  })),
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

jest.mock("react-native-system-navigation-bar", () => ({
  stickyImmersive: jest.fn(),
  navigationShow: jest.fn(),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  goBack: jest.fn(),
  navigationRef: {
    current: {
      dispatch: jest.fn(),
    },
  },
}));

const dispatchFn = jest.fn();
jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn(),
}));

jest.mock("../game-navigation.native", () => ({
  handleBack: jest.fn(),
}));

jest.mock("../../../helpers/webview-event.native", () => ({
  sendWrapperEvent: jest.fn(),
  forwardPYWMessages: jest.fn(),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: {},
  spacings: {},
  colors: {},
  typography: {},
  stackings: {},
}));

jest.mock("../../WebView/RNCCustomWebView", () => "RNCCustomWebView");

jest.mock("../../../config/environments.native", () => ({
  Environment: {},
}));

jest.mock("../../../config/base-path-utils.native", () => ({
  isCurrentEnv: jest.fn().mockReturnValueOnce(false),
}));

const webViewRefMock = {
  current: {
    goBack: jest.fn(),
    injectJavaScript: jest.fn(),
  },
};

function renderScreen() {
  return render(<GameLaunchScreen />);
}

describe("GameLaunchScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLogin.mockImplementation(() => jest.fn());
    React.useContext.mockReturnValue({
      isAuthenticated: true,
      recentlyPlayedUrn: "urn:game:12345",
    });
  });
  const loginMock = jest.fn();

  it("should call useRoute", () => {
    renderScreen();

    expect(useRoute).toHaveBeenCalled();
  });

  it("should set liseners", () => {
    const addListenerSpy = jest.spyOn(DeviceEventEmitter, "addListener");
    renderScreen();
    expect(addListenerSpy).toHaveBeenCalledWith(EVENTS.ON_LOGIN_CLOSED, expect.any(Function));
  });

  it("should call login if the user is logged out", () => {
    React.useContext.mockReturnValueOnce({
      isAuthenticated: false,
      recentlyPlayedUrn: "urn:game:12345",
    });
    useLogin.mockReturnValue(loginMock);

    renderScreen();

    expect(loginMock).toHaveBeenCalled();
  });

  it("should not call login if the platform is Android and user is logged in", () => {
    Platform.OS = "android";
    renderScreen();

    expect(loginMock).not.toHaveBeenCalled();
  });

  it("should not call login if the platform is ios", () => {
    Platform.OS = "ios";
    renderScreen();

    expect(loginMock).not.toHaveBeenCalled();
    expect(goBack).not.toHaveBeenCalled();
  });

  it("should render the component with the correct props", () => {
    renderScreen();

    expect(NativeWebView).toHaveBeenCalledWith(
      {
        style: { width: 400, height: 800 },
        originWhitelist: ["http://*", "https://*", "about:*"],
        cacheEnabled: false,
        javaScriptEnabled: true,
        onMessage: expect.any(Function),
        onNavigationStateChange: expect.any(Function),
        sharedCookiesEnabled: true,
        geolocationEnabled: true,
        nativeConfig: Platform.OS === "android" ? { component: RNCCustomWebView } : {},
        ref: {
          current: false,
        },
        source: {
          uri: viewUrlMock,
        },
      },
      undefined,
    );
  });

  describe("when setting the orientation", () => {
    it("should call .getInitialOrientation", () => {
      renderScreen();

      expect(Orientation.getInitialOrientation).toHaveBeenCalledTimes(1);
    });

    it("should call .unlockAllOrientations", () => {
      renderScreen();

      expect(Orientation.unlockAllOrientations).toHaveBeenCalledTimes(1);
    });

    describe("on unmount", () => {
      describe("and when the initial orientation is 'PORTRAIT'", () => {
        it("should call .lockToPortrait", () => {
          Orientation.getInitialOrientation.mockReturnValueOnce("PORTRAIT");
          const { unmount } = renderScreen();

          act(() => {
            unmount();
          });

          expect(Orientation.lockToPortrait).toHaveBeenCalledTimes(1);
          expect(Orientation.lockToLandscape).not.toHaveBeenCalled();
        });
      });

      describe("and when the initial orientation is 'PORTRAIT-UPSIDEDOWN'", () => {
        it("should call .lockToPortrait", () => {
          Orientation.getInitialOrientation.mockReturnValueOnce("PORTRAIT-UPSIDEDOWN");
          const { unmount } = renderScreen();

          act(() => {
            unmount();
          });

          expect(Orientation.lockToPortrait).toHaveBeenCalledTimes(1);
          expect(Orientation.lockToLandscape).not.toHaveBeenCalled();
        });
      });

      describe("and when the initial orientation is 'LANDSCAPE-LEFT'", () => {
        it("should call .lockToLandscape", () => {
          Orientation.getInitialOrientation.mockReturnValueOnce("LANDSCAPE-LEFT");
          const { unmount } = renderScreen();

          act(() => {
            unmount();
          });

          expect(Orientation.lockToLandscape).toHaveBeenCalledTimes(1);
          expect(Orientation.lockToPortrait).not.toHaveBeenCalled();
        });
      });

      describe("and when the initial orientation is 'LANDSCAPE-RIGHT'", () => {
        it("should call .lockToLandscape", () => {
          Orientation.getInitialOrientation.mockReturnValueOnce("LANDSCAPE-RIGHT");
          const { unmount } = renderScreen();

          act(() => {
            unmount();
          });

          expect(Orientation.lockToLandscape).toHaveBeenCalledTimes(1);
          expect(Orientation.lockToPortrait).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when the hardware back is pressed", () => {
    it("should call handleBack", async () => {
      jest.spyOn(React, "useRef").mockImplementationOnce(() => webViewRefMock);
      getStore.mockReturnValue({
        dispatch: dispatchFn,
      });
      renderScreen();
      await BackHandler.addEventListener.mock.calls[0][1]();
      expect(dispatchFn).toHaveBeenCalled();
    });
  });

  describe("When a WebView link in pressed", () => {
    describe("and it is an arcade return URL", () => {
      it("should go back from arcade to lobby", async () => {
        jest.spyOn(React, "useRef").mockImplementationOnce(() => webViewRefMock);

        renderScreen();

        const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
        await act(() => onNavigationStateChange({ url: "https://arcade.betfair.com" }));

        expect(goBack).toHaveBeenCalled();
      });
    });

    describe("and it is a sportsgaming return URL", () => {
      it("should go back from sportsgaming to lobby", async () => {
        jest.spyOn(React, "useRef").mockImplementationOnce(() => ({
          current: {
            goBack: jest.fn(),
          },
        }));
        renderScreen();
        const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
        await act(() => onNavigationStateChange({ url: "https://sportsgaming.betfair.com" }));
        expect(goBack).toHaveBeenCalled();
      });
    });

    describe("and it is a route inside the app", () => {
      it("should go back to casino lobby", async () => {
        jest.spyOn(React, "useRef").mockImplementationOnce(() => ({
          current: {
            goBack: jest.fn(),
          },
        }));
        findRouteWithUrl.mockResolvedValueOnce("urn");
        renderScreen();
        const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
        await act(() => onNavigationStateChange({ url: "https://betfair.com" }));
        expect(findRouteWithUrl).toHaveBeenCalledWith("https://betfair.com", "betfair.com", "betting|aaa|bbbb|dddd");
        expect(goBack).toHaveBeenCalled();
      });
    });

    describe("and it is a valid game url", () => {
      it("should stay inside the web view when URL matches /play?gameId=", async () => {
        jest.spyOn(React, "useRef").mockImplementationOnce(() => ({
          current: {
            goBack: jest.fn(),
          },
        }));
        findRouteWithUrl.mockResolvedValueOnce("urn");
        renderScreen();
        const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
        await act(() =>
          onNavigationStateChange({
            url: "https://casino.betfair.com/gaming-launcher/play?gameId=betfair-even-biggerb-abp&channel=y&returnURL=https://launcher.betfair.com/?goToOrigin=true",
          }),
        );
        expect(goBack).not.toHaveBeenCalled();
      });

      it("should stay inside the web view when URL matches /play/?gameId= (trailing slash)", async () => {
        jest.spyOn(React, "useRef").mockImplementationOnce(() => ({
          current: {
            goBack: jest.fn(),
          },
        }));
        findRouteWithUrl.mockResolvedValueOnce("urn");
        renderScreen();
        const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
        await act(() =>
          onNavigationStateChange({
            url: "https://casino.betfair.com/gaming-launcher/play/?gameId=betfair-even-biggerb-abp&channel=y&returnURL=https://launcher.betfair.com/?goToOrigin=true",
          }),
        );
        expect(goBack).not.toHaveBeenCalled();
      });
    });

    describe("and it is a casino return URL", () => {
      it("should go back from casino to lobby", async () => {
        jest.spyOn(React, "useRef").mockImplementationOnce(() => webViewRefMock);

        renderScreen();

        const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
        await act(() => onNavigationStateChange({ url: "https://casino.betfair.com" }));

        expect(goBack).toHaveBeenCalled();
      });

      describe("and it is a launcher return URL", () => {
        it("should go back from launcher to lobby", async () => {
          jest.spyOn(React, "useRef").mockImplementationOnce(() => webViewRefMock);

          renderScreen();

          const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
          await act(() => onNavigationStateChange({ url: "https://launcher.betfair.com/view/?goToOrigin=true" }));

          expect(goBack).toHaveBeenCalled();
        });
      });

      describe("and it is NOT a return URL", () => {
        it("should not go back to lobby", async () => {
          jest.spyOn(React, "useRef").mockImplementationOnce(() => webViewRefMock);
          Platform.OS = "ios";
          useLogin.mockReturnValue(() => true);
          renderScreen();

          const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
          await act(() => onNavigationStateChange({ url: "https://launcher.betfair.com" }));

          expect(goBack).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when onMessage is called", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should call sendWrapperEvent", () => {
      jest.spyOn(React, "useRef").mockImplementationOnce(() => webViewRefMock);
      renderScreen();
      const onMessageHandler = NativeWebView.mock.calls[0][0].onMessage;
      onMessageHandler("someEventData");
      expect(forwardPYWMessages).toHaveBeenCalledWith("someEventData", webViewRefMock);
      expect(sendWrapperEvent).toHaveBeenCalledWith("someEventData");
    });
  });
});
