import * as React from "react";
import { Platform } from "react-native";
import { renderHook } from "@testing-library/react-native";
import { useHandleGamingDeeplink } from "./useHandleGamingDeeplink.native";
import GamingContext from "../components/GamingPage/GamingContext";

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
  CommonActions: {
    setParams: jest.fn(() => ({ type: "SET_PARAMS" })),
  },
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  CetContext: require("react").createContext({}),
}));

jest.mock("../config/app-configuration.native", () => ({
  deeplinkConfiguration: {
    gameCollectionUrnPattern: /rebuild\.\w+\/betting\/casino\/c/,
    gameLaunchURLPattern: /^https:\/\/launcher\.rebuild(\.\w+)+/,
  },
}));
jest.mock("@ppb/tbd-router", () => ({
  navigationRef: {
    current: {
      dispatch: jest.fn(),
    },
  },
  navigate: jest.fn(),
}));

const ReactNavigation = require("@react-navigation/native");

const mockUseRoute = (url) => {
  ReactNavigation.useRoute.mockReturnValue({
    params: {
      params: {
        viewLink: {
          viewUrl: url,
          viewUrn: "casinoUrn",
        },
        isDeepLink: true,
      },
    },
    key: "mock-key",
  });
};

describe("useHandleGamingDeeplink", () => {
  const setDeepLinkUrl = jest.fn();
  const setDeepLinkUrn = jest.fn();
  const setGameInfo = jest.fn();
  const CetContext = require("@flutter-global/react-native-cet-framework").CetContext;

  describe("Platform is IOS", () => {
    beforeEach(() => {
      Platform.OS = "ios";
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("sets deepLinkUrn if viewLinkUrl matches URN pattern", () => {
      mockUseRoute("https://rebuild.com/betting/casino/c/slots");
      const wrapper = ({ children }) => (
        <GamingContext.Provider value={{ setDeepLinkUrn, setDeepLinkUrl, setRecentlyPlayedUrn: () => {} }}>
          <CetContext.Provider value={{ setGameInfo }}>{children}</CetContext.Provider>
        </GamingContext.Provider>
      );
      renderHook(() => useHandleGamingDeeplink(), { wrapper });
      expect(setDeepLinkUrn).toHaveBeenCalledWith("slots");
      expect(setDeepLinkUrl).not.toHaveBeenCalled();
      expect(setGameInfo).not.toHaveBeenCalled();
    });

    it("sets gameInfo if viewLinkUrl matches gameLaunchURLPattern with gameId", () => {
      mockUseRoute("https://launcher.rebuild.com");
      const wrapper = ({ children }) => (
        <GamingContext.Provider value={{ setDeepLinkUrn, setDeepLinkUrl, setRecentlyPlayedUrn: () => {} }}>
          <CetContext.Provider value={{ setGameInfo }}>{children}</CetContext.Provider>
        </GamingContext.Provider>
      );
      renderHook(() => useHandleGamingDeeplink(), { wrapper });

      expect(setGameInfo).toHaveBeenCalled();
    });

    it("sets deepLinkUrl if viewLinkUrl is a generic HTTP link", () => {
      mockUseRoute("https://casino.rebuild.com");
      const wrapper = ({ children }) => (
        <GamingContext.Provider value={{ setDeepLinkUrn, setDeepLinkUrl, setRecentlyPlayedUrn: () => {} }}>
          <CetContext.Provider value={{ setGameInfo }}>{children}</CetContext.Provider>
        </GamingContext.Provider>
      );
      renderHook(() => useHandleGamingDeeplink(), { wrapper });

      expect(setDeepLinkUrl).toHaveBeenCalledWith("https://casino.rebuild.com");
    });
  });
});
