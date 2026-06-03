/* eslint-disable no-undef */
import { fireEvent, render } from "@testing-library/react-native";
import { Platform, Text } from "react-native";
import { ErrorFallback } from "./ErrorFallback.native";
import { SettingsView } from "../SettingsView/SettingsView.native";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
  spacings: {},
  typography: {},
}));

jest.mock("../DebugInfo/DebugInfo.native", () => ({
  DebugInfo: ({ props }) => <mock-debug-info {...props} />,
}));

jest.mock("../SettingsView/SettingsView.native", () => ({
  SettingsView: jest.fn(({ props }) => <mock-settings-view {...props} />),
}));

jest.mock("../../config/app-configuration.native", () => ({
  appConfig: {
    TBDN_DEFAULT_ENVIRONMENT: "prd",
    TBDN_RELEASE_MODE: "production",
    APP_KEYS: { ios: "bla" },
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderErrorFallback(props) {
  return render(<ErrorFallback {...props} />);
}

const dev = __DEV__;
const { OS } = Platform;

describe("ErrorFallback", () => {
  describe("in dev mode", () => {
    let debugContainer;
    let showSettingsButton;
    let queryByTestId;

    beforeEach(() => {
      __DEV__ = true;
      ({ queryByTestId } = renderErrorFallback());
      debugContainer = queryByTestId("debugContainer");
      showSettingsButton = queryByTestId("settingsButton");
    });

    it("should show the debug info", () => {
      expect(debugContainer).not.toBeNull();
    });

    it("should show settings button", () => {
      expect(showSettingsButton).not.toBeNull();
    });

    describe("when settings button is pressed", () => {
      it("should show settings", () => {
        expect(showSettingsButton).not.toBeNull();
        fireEvent.press(showSettingsButton);
        expect(SettingsView).toHaveBeenCalled();
      });
    });
  });

  describe("out of dev mode", () => {
    let debugContainer;
    let fallbackText;

    beforeEach(() => {
      __DEV__ = false;
      const text = "Testing123";
      const { queryByTestId, queryByText } = renderErrorFallback({ children: <Text>{text}</Text> });
      debugContainer = queryByTestId("debugContainer");
      fallbackText = queryByText(text);
    });

    it("should not show the debug info", () => {
      expect(debugContainer).toBeNull();
      expect(fallbackText).not.toBeNull();
    });
  });

  afterAll(() => {
    __DEV__ = dev;
    Platform.OS = OS;
  });
});
