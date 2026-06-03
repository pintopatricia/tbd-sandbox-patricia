import * as React from "react";
import { Platform } from "react-native";
import { act, fireEvent, render, renderAsync, waitFor } from "@testing-library/react-native";

import { SettingsView } from "./SettingsView.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isAuthenticated: true,
  })),
}));

jest.mock("@react-navigation/drawer", () => ({
  DrawerStatusContext: jest.fn(() => ({})),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  multiGet: jest.fn().mockReturnValue([]),
}));

const mockLogin = jest.fn();

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  useLogin: jest.fn(() => mockLogin),
}));

jest.mock("@ppb/tbd-router", () => ({
  navigateWithThirdPartyScreenName: jest.fn(),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  typography: {},
  spacings: {},
  tokens: {},
}));

jest.mock("../../config/env-cookies/handler.native", () => ({
  getEnvironmentCookieHandler: jest.fn(),
}));

jest.mock("../EnvironmentBanner/EnvironmentBanner.native", () => ({
  EnvironmentBanner: jest.fn(() => <environment-banner-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
  TextInput: jest.requireActual("react-native").TextInput,
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn(),
  setA11yTestsMode: jest.fn(),
  isA11yTestsMode: jest.fn().mockReturnValue(true),
}));

const renderView = async ({ hasGameLaunchDebugView } = {}) => {
  const { queryByTestId } = await waitFor(() =>
    renderAsync(<SettingsView hasGameLaunchDebugView={hasGameLaunchDebugView} />),
  );

  return {
    settingsView: queryByTestId("settings-view"),
    debugView: queryByTestId("debug-view"),
    gameLaunchDebugView: queryByTestId("game-launch-debug-view"),
    gameLaunchButton: queryByTestId("game-launch-button"),
  };
};

describe("SettingsView", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the settings view container", async () => {
    const { settingsView } = await renderView();

    expect(settingsView).not.toBeNull();
  });

  it("should render the debug view", async () => {
    const { debugView } = await renderView();

    expect(debugView).not.toBeNull();
  });

  describe("when Platform is ios and hasGameLaunchDebugView is true", () => {
    beforeEach(() => {
      Platform.OS = "ios";
    });

    describe("when the Game Launch button is pressed", () => {
      it("should navigate to login screen if user is not logged in", async () => {
        React.useContext.mockReturnValue({ isAuthenticated: false });

        const { gameLaunchButton } = await renderView({ hasGameLaunchDebugView: true });

        fireEvent.press(gameLaunchButton);

        expect(mockLogin).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when Platform is android and hasGameLaunchDebugView is true", () => {
    beforeEach(() => {
      Platform.OS = "android";
    });

    it("should render the game launch debug view and button", async () => {
      const { gameLaunchDebugView, gameLaunchButton } = await renderView({ hasGameLaunchDebugView: true });

      expect(gameLaunchDebugView).not.toBeNull();
      expect(gameLaunchButton).not.toBeNull();
    });

    describe("when the Game Launch button is pressed", () => {
      it("should navigate to login screen if user is not logged in", async () => {
        React.useContext.mockReturnValue({ isAuthenticated: false });

        const { gameLaunchButton } = await renderView({ hasGameLaunchDebugView: true });

        fireEvent.press(gameLaunchButton);

        expect(mockLogin).toHaveBeenCalledTimes(1);
      });
    });
  });
});
