import { navigate } from "@ppb/tbd-router/native";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import {
  sendWrapperEvent,
  handleCetEventMessages,
  readMessagesInjetedJavascript,
  forwardPYWMessages,
} from "./webview-event.native";
import { isMetaDataEvent, sendEvent } from "../gtm/tagging-collector.native";
import { isJsonString } from "./json.native";

jest.mock("react-native-webview");

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(() => {}),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  EntityType: {
    ExternalView: "ppb:tbd:view:external",
  },
}));

jest.mock("@ppb/tbd-store/state/layout/cards/ViewLink.types", () => ({
  DisplayMode: {
    BlankWebview: "BLANK_WEBVIEW",
  },
}));

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
  PermissionsAndroid: {
    request: () => "granted",
  },
}));

jest.mock("rn-fetch-blob", () => ({
  DocumentDir: () => {},
  fetch: () => {},
  config: jest.fn(() => {}),
  fs: () => {},
}));

jest.mock("../gtm/tagging-collector.native", () => ({
  sendEvent: jest.fn(),
  isMetaDataEvent: jest.fn(),
}));

jest.mock("./json.native", () => ({
  isJsonString: jest.fn(),
}));

const onLanguageChangeFn = jest.fn();
const onTimezoneChangeFn = jest.fn();
const onBiometricChangeFn = jest.fn();
const onPasswordChangeFn = jest.fn();
const injectJavaScriptFn = jest.fn();
const webviewRefMock = {
  current: {
    injectJavaScript: injectJavaScriptFn,
  },
};

describe("webview event helper", () => {
  describe("readMessagesInjectedJavascript", () => {
    it("should return the javascript code to inject on webview", () => {
      expect(readMessagesInjetedJavascript).toBe(`window.addEventListener("message", (event) => {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    ...event.data,
    origin: window.location.origin,
  }))
});

window.isRebuildNative = true;
`);
    });
  });

  describe("handleCetEventMessages", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    describe("when message type is LANGUAGE.UPDATED", () => {
      it("should call onLanguageChange function", () => {
        handleCetEventMessages(
          { nativeEvent: { data: '{"type": "LANGUAGE.UPDATED", "message": "my message 1" }' } },
          onLanguageChangeFn,
          onTimezoneChangeFn,
          onBiometricChangeFn,
          onPasswordChangeFn,
        );
        expect(onLanguageChangeFn).toHaveBeenCalledWith("my message 1");
        expect(onTimezoneChangeFn).not.toHaveBeenCalled();
        expect(onBiometricChangeFn).not.toHaveBeenCalled();
        expect(onPasswordChangeFn).not.toHaveBeenCalled();
      });
    });
    describe("when message type is TIMEZONE.UPDATED", () => {
      it("should call onTimezoneChange function", () => {
        handleCetEventMessages(
          { nativeEvent: { data: '{"type": "TIMEZONE.UPDATED", "message": "my message 2" }' } },
          onLanguageChangeFn,
          onTimezoneChangeFn,
          onBiometricChangeFn,
          onPasswordChangeFn,
        );
        expect(onTimezoneChangeFn).toHaveBeenCalledWith("my message 2");
        expect(onLanguageChangeFn).not.toHaveBeenCalled();
        expect(onBiometricChangeFn).not.toHaveBeenCalled();
        expect(onPasswordChangeFn).not.toHaveBeenCalled();
      });
    });
    describe("when message type is BIOMETRIC.UPDATED", () => {
      it("should call onBiometricChange function", () => {
        handleCetEventMessages(
          { nativeEvent: { data: '{"type": "BIOMETRIC.UPDATED", "message": "my message 3"}' } },
          onLanguageChangeFn,
          onTimezoneChangeFn,
          onBiometricChangeFn,
          onPasswordChangeFn,
        );
        expect(onBiometricChangeFn).toHaveBeenCalledWith();
        expect(onLanguageChangeFn).not.toHaveBeenCalled();
        expect(onTimezoneChangeFn).not.toHaveBeenCalled();
        expect(onPasswordChangeFn).not.toHaveBeenCalled();
      });
    });
    describe("when message type is PASSWORD.UPDATED", () => {
      it("should call onPasswordChange function", () => {
        handleCetEventMessages(
          { nativeEvent: { data: '{"type": "PASSWORD.UPDATED", "message": "my message 4" }' } },
          onLanguageChangeFn,
          onTimezoneChangeFn,
          onBiometricChangeFn,
          onPasswordChangeFn,
        );
        expect(onPasswordChangeFn).toHaveBeenCalledWith();
        expect(onLanguageChangeFn).not.toHaveBeenCalled();
        expect(onTimezoneChangeFn).not.toHaveBeenCalled();
        expect(onBiometricChangeFn).not.toHaveBeenCalled();
      });
    });
    describe("when message type is VIEW.ITALIAN.CONTRACT", () => {
      it("should call navigate function", () => {
        handleCetEventMessages(
          { nativeEvent: { data: '{"type": "VIEW.ITALIAN.CONTRACT", "message": "url" }' } },
          onLanguageChangeFn,
          onTimezoneChangeFn,
          onBiometricChangeFn,
          onPasswordChangeFn,
        );
        expect(onPasswordChangeFn).not.toHaveBeenCalled();
        expect(onLanguageChangeFn).not.toHaveBeenCalled();
        expect(onTimezoneChangeFn).not.toHaveBeenCalled();
        expect(onBiometricChangeFn).not.toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith({
          viewUrn: "ppb:tbd:view:external",
          viewUrl: "url",
          viewDisplayMode: "BLANK_WEBVIEW",
        });
      });
    });

    describe("when message type is not recognized", () => {
      it("should not call any function", () => {
        handleCetEventMessages(
          { nativeEvent: { data: '{"type": "TBD.UPDATED", "message": "my message 5" }' } },
          onLanguageChangeFn,
          onTimezoneChangeFn,
          onBiometricChangeFn,
          onPasswordChangeFn,
        );
        expect(onLanguageChangeFn).not.toHaveBeenCalled();
        expect(onTimezoneChangeFn).not.toHaveBeenCalled();
        expect(onBiometricChangeFn).not.toHaveBeenCalled();
        expect(onPasswordChangeFn).not.toHaveBeenCalled();
      });
    });
  });

  describe("sendWrapperEvent", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("when event data is not a GA4 web event", () => {
      it("should not send a GA event to firebase", () => {
        const mockEvent = {
          nativeEvent: "empty data",
        };
        sendWrapperEvent(mockEvent);

        expect(isMetaDataEvent).not.toHaveBeenCalled();
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when event data is a meta data GA4 web event", () => {
      it("should not send a GA event to firebase", () => {
        isMetaDataEvent.mockImplementation(() => true);
        isJsonString.mockImplementation(() => true);
        const mockEvent = {
          nativeEvent: {
            data: JSON.stringify({
              command: "logEvent",
              parameters: {
                name: "fake prop",
              },
            }),
          },
        };
        sendWrapperEvent(mockEvent);

        expect(isMetaDataEvent).toHaveBeenCalled();
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when event data is NOT a meta data GA4 web event", () => {
      it("should send a GA event to firebase", () => {
        isMetaDataEvent.mockImplementation(() => false);
        isJsonString.mockImplementation(() => false);
        const mockEvent = {
          nativeEvent: {
            data: {
              command: "logEvent",
              parameters: {
                name: "fake prop",
              },
            },
          },
        };
        sendWrapperEvent(mockEvent);

        expect(isMetaDataEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          name: "fake prop",
          product: PlatformType.Wrapper,
        });
      });
    });
  });

  describe("forwardPYWMessages", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("when event data is not a valid event", () => {
      it("should not forward the event to WebView", () => {
        const mockEvent = {
          nativeEvent: {
            data: JSON.stringify({
              command: "logEvent",
              parameters: {
                name: "fake prop",
              },
            }),
          },
        };
        forwardPYWMessages(mockEvent, webviewRefMock);

        expect(injectJavaScriptFn).not.toHaveBeenCalled();
      });
    });

    describe("when event data is not a PYW event", () => {
      it("should not forward the event to WebView", () => {
        const mockEvent = {
          nativeEvent: "empty data",
        };
        forwardPYWMessages(mockEvent, webviewRefMock);

        expect(injectJavaScriptFn).not.toHaveBeenCalled();
      });
    });

    describe("when event data is valid PYW event", () => {
      it("should forward event to WebView", () => {
        isMetaDataEvent.mockImplementation(() => false);
        isJsonString.mockImplementation(() => false);
        const mockEvent = {
          nativeEvent: {
            data: {
              source: "PYW",
            },
          },
        };
        const injectedJS = `
      (function() {
        window.postMessage(JSON.parse('{"source":"PYW"}'), '*');
      })();
    `;

        forwardPYWMessages(mockEvent, webviewRefMock);
        expect(injectJavaScriptFn).toHaveBeenCalledTimes(1);
        expect(injectJavaScriptFn).toHaveBeenCalledWith(injectedJS);
      });
    });
  });
});
