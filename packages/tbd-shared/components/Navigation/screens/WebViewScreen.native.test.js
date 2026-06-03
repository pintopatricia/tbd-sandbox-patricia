import * as React from "react";
import { render, act, waitFor } from "@testing-library/react-native";
import { BackHandler, DeviceEventEmitter } from "react-native";
import { goBack, navigateWithThirdPartyScreenName, navigate } from "@ppb/tbd-router/native";
import { EVENTS, useLogin } from "@flutter-global/react-native-cet-framework";
import NativeWebView from "./NativeWebView.native";
import { sendWrapperEvent } from "../../../helpers/webview-event.native";
import { handleWebHardwareBack } from "../game-navigation.native";
import WebViewScreen from "./WebViewScreen.native";
import { getHomepagePaths, getHost } from "../../../config/endpoints";

jest.mock("../../../config/endpoints", () => ({
  getHost: jest.fn().mockReturnValue("betfair.com"),
  getHomepagePaths: jest.fn().mockReturnValue("betting|aaa|bbbb|dddd"),
}));

const mockEmit = jest.fn();
jest.mock("eventemitter3-singleton", () => ({
  getEventRegistry: jest.fn(() => ({ emit: mockEmit })),
}));

const viewUrlMock = "some url";
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn((initialValue) => ({ current: initialValue })),
  useContext: jest.fn(() => ({
    setGameInfo: jest.fn(),
  })),
  useState: jest.fn(() => [viewUrlMock, jest.fn()]),
}));

jest.mock("@ppb/tbd-shared/hooks/useAppBrand", () => ({
  useAppBrand: jest.fn(() => "betfair"),
}));

jest.mock("react-native", () => {
  const { StyleSheet, Text, View, DeviceInfo } = jest.requireActual("react-native");

  return {
    BackHandler: {
      addEventListener: jest.fn(),
    },
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView: View,
    DeviceEventEmitter: {
      addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
    },
    Platform: {
      OS: "android",
    },
    DeviceInfo,
  };
});

jest.mock("./NativeWebView.native", () => jest.fn(() => <native-web-view-mock />));

const mockLogin = jest.fn();
jest.mock("@flutter-global/react-native-cet-framework", () => ({
  CetContext: {
    setGameInfo: jest.fn(),
    isAuthenticated: true,
  },
  EVENTS: {
    ON_LOGIN_CLOSED: "ON_LOGIN_CLOSED",
  },
  useLogin: jest.fn(() => mockLogin),
}));

const mockIsFocused = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(() => ({
    params: {
      viewLink: {
        viewUrl: viewUrlMock,
        hideBackButton: true,
      },
    },
  })),
  useIsFocused: () => mockIsFocused(),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  navigateWithThirdPartyScreenName: jest.fn(),
  ScreenName: {
    GameLaunchScreen: "GameLaunchScreen",
  },
}));

jest.mock("../../../helpers/user-agent.native", () => ({
  getCustomWebViewUserAgent: jest.fn().mockReturnValue("fake-user-agent"),
}));

jest.mock("../../../helpers/webview-event.native", () => ({
  sendWrapperEvent: jest.fn(),
}));

jest.mock("../game-navigation.native", () => ({
  handleWebHardwareBack: jest.fn(),
}));

jest.mock("../../../config/app-configuration.native", () => ({
  deeplinkConfiguration: {
    gameLaunchURLPattern: /launcher\.rebuild(\.\w+)+/,
    cetLoginUrlPattern: /^https:\/\/identitysso\.betfair(\.\w+)+\/view\/login/,
    newGameLaunchPattern: /newlauncher\.rebuild(\.\w+)+/,
  },
}));

function renderScreen() {
  return render(<WebViewScreen />);
}

describe("WebViewScreen", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  describe("when the OS back is pressed", () => {
    describe("and the webViewRef is defined", () => {
      it("should call handleWebInGameAndroidBack", async () => {
        jest.spyOn(React, "useRef").mockImplementationOnce(() => ({
          current: {
            goBack: jest.fn(),
          },
        }));

        renderScreen();
        await BackHandler.addEventListener.mock.calls[0][1]();

        expect(handleWebHardwareBack).toHaveBeenCalled();
      });
    });

    describe("and the webViewRef is not defined", () => {
      it("should not call handleWebInGameAndroidBack", async () => {
        jest.spyOn(React, "useRef").mockImplementationOnce(() => null);

        renderScreen();

        await BackHandler.addEventListener.mock.calls[0][1]();
        expect(handleWebHardwareBack).not.toHaveBeenCalled();
      });
    });
  });

  describe("when onMessage is called", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(React, "useRef").mockImplementation((initialValue) => ({
        current: initialValue,
      }));
    });

    it("should call sendWrapperEvent", () => {
      renderScreen();
      const onMessageHandler = NativeWebView.mock.calls[0][0].onMessage;
      const mockEventData = {
        nativeEvent: {
          data: "mock event data",
        },
      };
      onMessageHandler(mockEventData);

      expect(sendWrapperEvent).toHaveBeenCalledWith(mockEventData);
    });

    it("should go back exactly once even if multiple close messages are received", () => {
      renderScreen();
      const onMessageHandler = NativeWebView.mock.calls[0][0].onMessage;
      const closeInappBrowserEvent = {
        nativeEvent: {
          data: "closeInappBrowser",
        },
      };
      // First event dispatch
      act(() => {
        onMessageHandler(closeInappBrowserEvent);
      });
      expect(goBack).toHaveBeenCalledTimes(1);
      // Second event dispatch (simulate a double-post from JS)
      act(() => {
        onMessageHandler(closeInappBrowserEvent);
      });
      // Verify that it remains at 1 (the lock canCloseInAppBrowser.current worked)
      expect(goBack).toHaveBeenCalledTimes(1);
    });

    describe("and the event is open game in app", () => {
      const openGameInApp = "openGameInApp";
      const mockGameLaunchUrl = "https://launcher.betfair.com";
      const mockEventData = { nativeEvent: { data: `{"type": "${openGameInApp}","url": "${mockGameLaunchUrl}"}` } };
      it("should navigate to game launch screen", () => {
        renderScreen();
        const onMessageHandler = NativeWebView.mock.calls[0][0].onMessage;
        onMessageHandler(mockEventData);
        expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith("GameLaunchScreen", {
          viewLink: {
            viewUrl: mockGameLaunchUrl,
          },
        });
      });
    });

    describe("and the event is to close the in app browser", () => {
      const CLOSE_IN_APP_BROWSER = "closeInappBrowser";
      const mockEventData = {
        nativeEvent: {
          data: CLOSE_IN_APP_BROWSER,
        },
      };

      describe("and the event is the first one", () => {
        it("should go back", () => {
          renderScreen();
          const onMessageHandler = NativeWebView.mock.calls[0][0].onMessage;
          const mockEventData = { nativeEvent: { data: "closeInappBrowser" } };

          act(() => {
            onMessageHandler(mockEventData);
          });
          act(() => {
            onMessageHandler(mockEventData);
          });

          expect(goBack).toHaveBeenCalledTimes(1);
        });
      });

      describe("and the event is not the first one", () => {
        it("should not go back", () => {
          jest.spyOn(React, "useRef").mockReturnValue({ current: false });
          renderScreen();
          const onMessageHandler = NativeWebView.mock.calls[0][0].onMessage;

          onMessageHandler(mockEventData);

          expect(goBack).not.toHaveBeenCalled();
        });
      });
    });
  });
  describe("when handleNavigationStateChange is called", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("and navigate to app link", () => {
      it("should call navigate", () => {
        renderScreen();
        const mockUrl = "https://www.betfair.com/betting/football/s-1";
        const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
        const mockEventData = { url: mockUrl };
        onNavigationStateChange(mockEventData);
        expect(getHost).toHaveBeenCalled();
        expect(getHomepagePaths).toHaveBeenCalled();

        expect(navigate).toHaveBeenCalledWith({ viewUrl: mockUrl, viewUrn: "ppb:tbd:view:sport:1" });
      });

      it("should call navigate to home", () => {
        renderScreen();
        const mockUrl = "https://www.betfair.com/betting/";
        const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
        const mockEventData = { url: mockUrl };
        onNavigationStateChange(mockEventData);
        expect(getHost).toHaveBeenCalled();
        expect(getHomepagePaths).toHaveBeenCalled();

        expect(navigate).toHaveBeenCalledWith({ viewUrl: mockUrl, viewUrn: "ppb:tbd:view:generic:home" });
      });
    });
    describe("and navigate to unknown app link", () => {
      it("should call navigate", () => {
        renderScreen();
        const mockUrl = "https://xxx.betfair.com";
        const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];
        const mockEventData = { url: mockUrl };
        onNavigationStateChange(mockEventData);

        expect(navigate).not.toHaveBeenCalled();
      });
    });

    describe("and navigate to CET login link", () => {
      beforeEach(() => {
        React.useContext.mockReturnValue({
          isAuthenticated: false,
        });
      });
      it("should call native login and block navigation", () => {
        renderScreen();
        const mockUrl = "https://identitysso.betfair.com/view/login?redirectMethod=GET&product=bfrebuild&prod=90";
        const { onShouldStartLoadWithRequest } = NativeWebView.mock.calls[0][0];
        const result = onShouldStartLoadWithRequest({ url: mockUrl });

        expect(mockLogin).toHaveBeenCalled();
        expect(result).toBe(false);
      });

      it("should allow non-login URLs to proceed", () => {
        renderScreen();
        const { onShouldStartLoadWithRequest } = NativeWebView.mock.calls[0][0];
        const result = onShouldStartLoadWithRequest({ url: "https://www.betfair.com/some-page" });

        expect(mockLogin).not.toHaveBeenCalled();
        expect(result).toBe(true);
      });

      it("should set listeners", async () => {
        const addListenerSpy = jest.spyOn(DeviceEventEmitter, "addListener");
        renderScreen();
        await waitFor(() => {
          expect(addListenerSpy).toHaveBeenCalledWith(EVENTS.ON_LOGIN_CLOSED, expect.any(Function));
        });
      });
    });

    it("should NOT trigger game launch on Android via navigation state change", () => {
      renderScreen();
      const mockUrl = "https://launcher.rebuild.betfair.com";
      const { onNavigationStateChange } = NativeWebView.mock.calls[0][0];

      onNavigationStateChange({ url: mockUrl });
      expect(navigateWithThirdPartyScreenName).not.toHaveBeenCalled();
    });
  });

  describe("when login completes after CET login redirect", () => {
    it("should remount the WebView and reset the URL to the original", async () => {
      const mockSetCurrentUrl = jest.fn();
      const mockSetWebViewKey = jest.fn();
      const mockSetIsAwaitingLogin = jest.fn();

      jest
        .spyOn(React, "useState")
        .mockImplementationOnce(() => [viewUrlMock, mockSetCurrentUrl]) // currentUrl
        .mockImplementationOnce((init) => [init, jest.fn()]) // userAgent
        .mockImplementationOnce(() => [true, mockSetIsAwaitingLogin]) // isAwaitingLogin = true
        .mockImplementationOnce(() => [0, mockSetWebViewKey]); // webViewKey

      React.useContext.mockReturnValue({ isAuthenticated: true });

      renderScreen();

      // Flush queueMicrotask
      await act(async () => {});

      expect(mockSetIsAwaitingLogin).toHaveBeenCalledWith(false);
      expect(mockSetCurrentUrl).toHaveBeenCalledWith(viewUrlMock);
      expect(mockSetWebViewKey).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("CET login full flow: block, authenticate, remount", () => {
    const realUseState = jest.requireActual("react").useState;
    const realUseRef = jest.requireActual("react").useRef;

    beforeEach(() => {
      jest.clearAllMocks();
      React.useState.mockImplementation(realUseState);
      React.useRef.mockImplementation(realUseRef);
    });

    it("should block the login URL, then remount WebView with originalUrl after auth completes", async () => {
      // Step 1: Render unauthenticated – WebView shows originalUrl
      React.useContext.mockReturnValue({ isAuthenticated: false });
      const { rerender } = render(<WebViewScreen />);

      const initialCallCount = NativeWebView.mock.calls.length;
      const initialProps = NativeWebView.mock.calls[initialCallCount - 1][0];
      expect(initialProps.source.uri).toBe(viewUrlMock);

      // Step 2: CET login URL intercepted – navigation blocked, native login triggered
      let result;
      act(() => {
        result = initialProps.onShouldStartLoadWithRequest({
          url: "https://identitysso.betfair.com/view/login?redirectMethod=GET&product=bfrebuild&prod=90",
        });
      });
      expect(result).toBe(false);
      expect(mockLogin).toHaveBeenCalledTimes(1);

      // Step 3: Auth completes – effect resets URL and increments key, causing remount
      const callCountBeforeAuth = NativeWebView.mock.calls.length;
      await act(async () => {
        React.useContext.mockReturnValue({ isAuthenticated: true });
        rerender(<WebViewScreen />);
      });

      // WebView was re-rendered (remounted via key increment)
      expect(NativeWebView.mock.calls.length).toBeGreaterThan(callCountBeforeAuth);

      // Final render points back to originalUrl with authenticated session
      const lastCallIndex = NativeWebView.mock.calls.length - 1;
      expect(NativeWebView.mock.calls[lastCallIndex][0].source.uri).toBe(viewUrlMock);
    });
  });

  describe("when the component unmounts", () => {
    const realUseState = jest.requireActual("react").useState;
    const realUseRef = jest.requireActual("react").useRef;

    beforeEach(() => {
      jest.clearAllMocks();
      React.useState.mockImplementation(realUseState);
      React.useRef.mockImplementation(realUseRef);
    });

    it("should emit @@UI/WEBVIEW_SCREEN_CLOSED event", () => {
      const { unmount } = render(<WebViewScreen />);
      expect(mockEmit).not.toHaveBeenCalled();

      unmount();
      expect(mockEmit).toHaveBeenCalledWith("@@UI/WEBVIEW_SCREEN_CLOSED", undefined);
    });
  });
});
