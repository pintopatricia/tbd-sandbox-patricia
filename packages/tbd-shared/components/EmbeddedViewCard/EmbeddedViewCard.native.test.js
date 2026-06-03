import { render } from "@testing-library/react-native";
import { Platform } from "react-native";
import { CetContext, useBiometricLoginToggle } from "@flutter-global/react-native-cet-framework";
import { codecs } from "@ppb/tbd-urn-codecs";
import EmbeddedViewCard from "@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/view/EmbeddedViewCard.native";

import { getBasePath } from "../../config/base-path-utils.native";
import { handleCetEventMessages } from "../../helpers/webview-event.native";
import { getCustomWebViewUserAgent } from "../../helpers/user-agent.native";
import NativeWebView from "../Navigation/screens/NativeWebView.native";

import EmbeddedViewCardWrapper from "./EmbeddedViewCard.native";

jest.mock("@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/view/EmbeddedViewCard.native", () =>
  jest.fn(() => <mock-embedded-view-card />),
);

jest.mock("@flutter-global/react-native-cet-framework", () => {
  const React = require("react");
  return {
    CetContext: React.createContext({}),
    SetupPin: jest.fn(() => <mock-setup-pin />),
    useBiometricLoginToggle: jest.fn(),
  };
});

jest.mock("@ppb/tbd-urn-codecs", () => ({
  codecs: {
    parse: jest.fn(),
  },
}));

jest.mock("../../config/base-path-utils.native", () => ({
  getBasePath: jest.fn(() => "https://example.com"),
  APP_ENVIRONMENT_DEFAULT_PATH: "/app.environment.json",
}));

jest.mock("../../helpers/webview-event.native", () => ({
  readMessagesInjetedJavascript: "injected-js-mock",
  handleCetEventMessages: jest.fn(),
}));

jest.mock("../../helpers/user-agent.native", () => ({
  getCustomWebViewUserAgent: jest.fn(() => "custom-user-agent"),
}));

jest.mock("../Navigation/screens/NativeWebView.native", () => jest.fn(() => <native-web-view-mock />));

const mockCetContext = {
  changeLanguage: jest.fn(),
  updateTimezone: jest.fn(),
  authorizationToken: "mock-auth-token",
  logOut: jest.fn(),
};

const mockBiometricToggle = {
  isBiometricLoginActive: false,
  setToggleBiometricLoginActive: jest.fn(),
};

const mockUrn = "urn:test:456";

function setup(props = {}) {
  const defaultProps = {
    urn: "urn:test:123",
    visible: true,
  };

  return render(
    <CetContext.Provider value={mockCetContext}>
      <EmbeddedViewCardWrapper {...defaultProps} {...props} />
    </CetContext.Provider>,
  );
}

describe("EmbeddedViewCardWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBiometricLoginToggle.mockReturnValue(mockBiometricToggle);
    codecs.parse.mockReturnValue({ referenceId: "someOtherView" });
    Platform.OS = "ios";
  });

  describe("when rendering", () => {
    it("should render EmbeddedViewCard with correct props", () => {
      setup({ urn: mockUrn, visible: true });

      expect(EmbeddedViewCard).toHaveBeenCalledWith(
        expect.objectContaining({
          urn: mockUrn,
          visible: true,
          appEnv: "https://example.com/app.environment.json",
          webViewConfig: {
            NativeWebView,
            queryParams: "",
            readMessagesInjetedJavascript: "injected-js-mock",
            getCustomWebViewUserAgent,
          },
          userActions: {
            changeLanguage: mockCetContext.changeLanguage,
            updateTimezone: mockCetContext.updateTimezone,
            logOut: mockCetContext.logOut,
            setToggleBiometricLoginActive: mockBiometricToggle.setToggleBiometricLoginActive,
            handleCetEventMessages,
          },
          SetupPin: expect.any(Function),
        }),
        undefined,
      );
    });

    it("should call useBiometricLoginToggle with authorizationToken", () => {
      setup();

      expect(useBiometricLoginToggle).toHaveBeenCalledWith("mock-auth-token");
    });
  });

  describe("when urn is personalDetails", () => {
    beforeEach(() => {
      codecs.parse.mockReturnValue({ referenceId: "personalDetails" });
    });

    it("should add biometric and platform query params on iOS", () => {
      Platform.OS = "ios";
      mockBiometricToggle.isBiometricLoginActive = true;
      useBiometricLoginToggle.mockReturnValue(mockBiometricToggle);

      setup({ urn: "urn:personalDetails:123" });

      expect(EmbeddedViewCard).toHaveBeenCalledWith(
        expect.objectContaining({
          webViewConfig: expect.objectContaining({
            queryParams: "?biometric=true&platform=ios",
          }),
        }),
        undefined,
      );
    });

    it("should add biometric and platform query params on Android", () => {
      Platform.OS = "android";
      mockBiometricToggle.isBiometricLoginActive = false;
      useBiometricLoginToggle.mockReturnValue(mockBiometricToggle);

      setup({ urn: "urn:personalDetails:123" });

      expect(EmbeddedViewCard).toHaveBeenCalledWith(
        expect.objectContaining({
          webViewConfig: expect.objectContaining({
            queryParams: "?biometric=false&platform=android",
          }),
        }),
        undefined,
      );
    });
  });

  describe("when urn is NOT personalDetails", () => {
    it("should not add query params", () => {
      codecs.parse.mockReturnValue({ referenceId: "accountSettings" });

      setup({ urn: "urn:accountSettings:123" });

      expect(EmbeddedViewCard).toHaveBeenCalledWith(
        expect.objectContaining({
          webViewConfig: expect.objectContaining({
            queryParams: "",
          }),
        }),
        undefined,
      );
    });
  });

  describe("SetupPin prop", () => {
    it("should pass SetupPin as a render function", () => {
      const { SetupPin } = require("@flutter-global/react-native-cet-framework");

      setup();

      const setupPinProp = EmbeddedViewCard.mock.calls[0][0].SetupPin;
      const result = setupPinProp();

      expect(result.type).toBe(SetupPin);
    });
  });

  describe("appEnv", () => {
    it("should combine basePath with APP_ENVIRONMENT_DEFAULT_PATH", () => {
      setup();

      expect(getBasePath).toHaveBeenCalled();
      expect(EmbeddedViewCard).toHaveBeenCalledWith(
        expect.objectContaining({
          appEnv: "https://example.com/app.environment.json",
        }),
        undefined,
      );
    });
  });
});
