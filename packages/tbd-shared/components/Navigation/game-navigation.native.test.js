import { Platform } from "react-native";
import { handleBack, handleWebHardwareBack } from "./game-navigation.native";

const onGoBack = jest.fn();
const onCannotGoBack = jest.fn();

describe("when Android back button is used", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not call any handler if webviewref is not passed", () => {
    const webviewRef = null;
    const canGoBack = true;
    handleBack(webviewRef, canGoBack, onGoBack, onCannotGoBack);
    expect(onGoBack).toHaveBeenCalledTimes(0);
    expect(onCannotGoBack).toHaveBeenCalledTimes(0);
  });

  it("should call webview navigation handler", () => {
    const webviewRef = {};
    const canGoBack = true;
    handleBack(webviewRef, canGoBack, onGoBack, onCannotGoBack);
    expect(onGoBack).toHaveBeenCalledTimes(1);
    expect(onCannotGoBack).toHaveBeenCalledTimes(0);
  });

  it("should call external webview handler", () => {
    const webviewRef = {};
    const canGoBack = false;
    handleBack(webviewRef, canGoBack, onGoBack, onCannotGoBack);
    expect(onGoBack).toHaveBeenCalledTimes(0);
    expect(onCannotGoBack).toHaveBeenCalledTimes(1);
  });
});

describe("when hardware back button is used inside webview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the OS is android", () => {
    describe("and when the current url is not root url", () => {
      describe("and when current url is game url", () => {
        it("should load exit game url", () => {
          Platform.OS = "android";
          const injectJSMock = jest.fn();
          const webviewRef = {
            injectJavaScript: injectJSMock,
          };
          const currentUrl = "https://play.betfair.es";
          const rootUrl = "https://sportsgaming.betfair.es/";
          handleWebHardwareBack(webviewRef, currentUrl, rootUrl);
          expect(injectJSMock).toHaveBeenCalledTimes(1);
        });
      });
      describe("and when current url is not game url", () => {
        it("should load casino home url, if rootUrl is casino home url", () => {
          Platform.OS = "android";
          const injectJSMock = jest.fn();
          const webviewRef = {
            injectJavaScript: injectJSMock,
          };
          const currentUrl = "http://launcher.betfair.es";
          const rootUrl = "https://sportsgaming.betfair.es/";
          handleWebHardwareBack(webviewRef, currentUrl, rootUrl);
          expect(injectJSMock).toHaveBeenCalledTimes(1);
        });
        it("should return false, if rootUrl is not casino home url", () => {
          Platform.OS = "android";
          const injectJSMock = jest.fn();
          const webviewRef = {
            injectJavaScript: injectJSMock,
          };
          const currentUrl = "http://launcher.betfair.es";
          const rootUrl = "https://dummy-url.com";
          const result = handleWebHardwareBack(webviewRef, currentUrl, rootUrl);
          expect(injectJSMock).toHaveBeenCalledTimes(0);
          expect(result).toEqual(false);
        });
      });
    });
    describe("and when the current url is root url", () => {
      it("should return false", () => {
        Platform.OS = "android";
        const injectJSMock = jest.fn();
        const webviewRef = {
          injectJavaScript: injectJSMock,
        };
        const currentUrl = "https://sportsgaming.betfair.es/";
        const rootUrl = "https://sportsgaming.betfair.es/";
        const result = handleWebHardwareBack(webviewRef, currentUrl, rootUrl);
        expect(injectJSMock).toHaveBeenCalledTimes(0);
        expect(result).toEqual(false);
      });
    });
  });

  describe("when the OS is not android", () => {
    it("should return false", () => {
      Platform.OS = "ios";
      const injectJSMock = jest.fn();
      const webviewRef = {
        injectJavaScript: injectJSMock,
      };
      const currentUrl = "https://play.betfair.es";
      const rootUrl = "https://sportsgaming.betfair.es/";
      const result = handleWebHardwareBack(webviewRef, currentUrl, rootUrl);
      expect(injectJSMock).toHaveBeenCalledTimes(0);
      expect(result).toEqual(false);
    });
  });
});
