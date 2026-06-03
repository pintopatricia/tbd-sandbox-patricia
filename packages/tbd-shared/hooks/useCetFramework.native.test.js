import { useContext } from "react";
import { DeviceEventEmitter } from "react-native";
import { CetContext, cetMainConfiguration } from "@flutter-global/react-native-cet-framework";
import OTPublishersNativeSDK from "react-native-onetrust-cmp";
import { useSelector } from "react-redux";

import { act, renderHook, waitFor } from "@testing-library/react-native";

import useCetFramework from "./useCetFramework.native";

jest.mock("react-native-onetrust-cmp", () => ({
  getOTConsentJSForWebView: jest.fn(),
}));

const mockDispatch = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    authorizationToken: null,
    loadDataFromKeychain: jest.fn(),
    changeLanguage: jest.fn(),
    logOut: jest.fn(() => Promise.resolve()),
    setOneTrustWebViewJavascript: jest.fn(),
  })),
}));

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  CetContext: {
    authorizationToken: null,
    loadDataFromKeychain: jest.fn(),
    changeLanguage: jest.fn(),
    logOut: jest.fn(() => Promise.resolve()),
    setOneTrustWebViewJavascript: jest.fn(),
  },
  cetMainConfiguration: {
    setBrand: jest.fn(),
  },
}));

jest.mock("../config/app-configuration.native", () => ({ appBrand: "betfair" }));

const mockState = {
  entities: {
    appContextDetails: {
      failed: false,
    },
    userdetails: {
      localeCode: undefined,
    },
  },
};

const oneTrustListeners = {};

describe("useCetFramework", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();
    mockState.entities.appContextDetails.failed = false;
    mockState.entities.userdetails.localeCode = undefined;
    delete oneTrustListeners.UpdateOneTrustJavascriptWithinCET;

    useSelector.mockImplementation((selector) => selector(mockState));

    DeviceEventEmitter.addListener = jest.fn((eventName, callback) => {
      oneTrustListeners[eventName] = callback;

      return {
        remove: jest.fn(() => {
          delete oneTrustListeners[eventName];
        }),
      };
    });
  });

  it("should be defined", () => {
    expect(useCetFramework).toBeDefined();
  });

  it("should set CET brand and load data from keychain on mount", () => {
    useContext.mockReturnValue(CetContext);

    renderHook(() => useCetFramework());

    expect(cetMainConfiguration.setBrand).toHaveBeenCalledWith("betfair");
    expect(CetContext.loadDataFromKeychain).toHaveBeenCalledTimes(1);
  });

  it("should log out when app context failed", async () => {
    useContext.mockReturnValue(CetContext);
    mockState.entities.appContextDetails.failed = true;

    renderHook(() => useCetFramework());

    await waitFor(() => {
      expect(CetContext.logOut).toHaveBeenCalledTimes(1);
    });
  });

  it("should change language when locale code is available", () => {
    useContext.mockReturnValue(CetContext);
    mockState.entities.userdetails.localeCode = "en";

    renderHook(() => useCetFramework());

    expect(CetContext.changeLanguage).toHaveBeenCalledWith("en");
  });

  it("should dispatch SESSION__TOKEN_CHANGED on mount with current token", () => {
    useContext.mockReturnValue({ ...CetContext, authorizationToken: "initial-token" });

    renderHook(() => useCetFramework());

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SESSION/TOKEN_CHANGED",
      payload: {
        authenticationToken: "initial-token",
      },
    });
  });

  it("should dispatch SESSION__TOKEN_CHANGED with null when token is undefined", () => {
    useContext.mockReturnValue({ ...CetContext, authorizationToken: undefined });

    renderHook(() => useCetFramework());

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SESSION/TOKEN_CHANGED",
      payload: {
        authenticationToken: null,
      },
    });
  });

  it("should dispatch SESSION__TOKEN_CHANGED when authorization token changes after mount", () => {
    useContext.mockReturnValue({ ...CetContext, authorizationToken: null });

    const { rerender } = renderHook(() => useCetFramework());

    mockDispatch.mockClear();

    useContext.mockReturnValue({ ...CetContext, authorizationToken: "new-token" });
    rerender();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SESSION/TOKEN_CHANGED",
      payload: {
        authenticationToken: "new-token",
      },
    });
  });

  it("should update OneTrust javascript when event is emitted", async () => {
    useContext.mockReturnValue(CetContext);
    const consentJSForWebView = 'var OTExternalConsent = {"test": true};';
    OTPublishersNativeSDK.getOTConsentJSForWebView.mockResolvedValue(consentJSForWebView);
    const expectedOneTrustJS = `window.OTExternalConsent${consentJSForWebView.substring(21)}`;

    renderHook(() => useCetFramework());

    await act(async () => {
      await oneTrustListeners.UpdateOneTrustJavascriptWithinCET();
    });

    expect(OTPublishersNativeSDK.getOTConsentJSForWebView).toHaveBeenCalledTimes(1);
    expect(CetContext.setOneTrustWebViewJavascript).toHaveBeenCalledWith(expectedOneTrustJS);
  });
});
