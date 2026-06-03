import {
  getCustomHeadersSettings,
  getThrottlesSettings,
  initSettings,
  loadSettings,
  settingsConfig,
} from "./settings-utils.native";
import Storage, { SETTINGS_BUNDLE_KEYS } from "../helpers/storage.native";

const APP_CONFIG_MOCKS = {
  TBDN_RELEASE_MODE: "production",
  TBDN_DEFAULT_ENVIRONMENT: "prd",
};

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("../config/app-configuration.native.ts", () => ({ appConfig: APP_CONFIG_MOCKS }));
jest.mock("../helpers/storage.native");

describe("when loadSettings function is called", () => {
  it("should return a promise settings array", async () => {
    Storage.getItem = jest
      .fn()
      .mockResolvedValueOnce("mockserver")
      .mockResolvedValueOnce("INTERNATIONAL")
      .mockResolvedValueOnce({ Host: "betfair.com" })
      .mockResolvedValueOnce("http://0.0.0.0")
      .mockResolvedValueOnce("X-IP:1.1.1.1,X-COUNTRY-CODE:DK")
      .mockResolvedValueOnce("ssoid=test")
      .mockResolvedValueOnce("{}")
      .mockResolvedValueOnce(true);

    const settings = await loadSettings();

    return expect(settings).toEqual([
      { settingKey: SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT, settingValue: "mockserver" },
      { settingKey: SETTINGS_BUNDLE_KEYS.APP_JURISDICTION, settingValue: "INTERNATIONAL" },
      { settingKey: SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS, settingValue: { Host: "betfair.com" } },
      { settingKey: SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT, settingValue: "http://0.0.0.0" },
      { settingKey: SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS, settingValue: "X-IP:1.1.1.1,X-COUNTRY-CODE:DK" },
      { settingKey: SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES, settingValue: "ssoid=test" },
      { settingKey: SETTINGS_BUNDLE_KEYS.THROTTLES_OVERRIDE, settingValue: "{}" },
      { settingKey: SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS, settingValue: true },
    ]);
  });
});

describe("when initSettings is called", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when release mode is production", () => {
    beforeEach(async () => {
      APP_CONFIG_MOCKS.TBDN_RELEASE_MODE = "production";
      await initSettings();
    });

    it("should keep the default values for settingsConfig", () => {
      expect(settingsConfig).toEqual({
        app_environment: "prd",
        app_jurisdiction: "INTERNATIONAL",
        generated_app_headers: {},
        custom_app_cookies: "",
        custom_app_environment: "",
        custom_app_headers: "",
        throttles_override: {},
        disable_a11y_labels: true,
      });
    });
  });

  describe("when release mode is not production", () => {
    beforeEach(async () => {
      APP_CONFIG_MOCKS.TBDN_RELEASE_MODE = "internal";
      Storage.getItem = jest
        .fn()
        .mockResolvedValueOnce("mockserver")
        .mockResolvedValueOnce("INTERNATIONAL")
        .mockResolvedValueOnce({ Host: "betfair.com" })
        .mockResolvedValueOnce("http://0.0.0.0")
        .mockResolvedValueOnce("X-IP:1.1.1.1,X-COUNTRY-CODE:DK")
        .mockResolvedValueOnce("ssoid=test")
        .mockResolvedValueOnce('{ "THROTTLE_A": { "isActive": true } }')
        .mockResolvedValueOnce(false);
      await initSettings();
    });

    it("should change the values for settingsConfig", () => {
      expect(settingsConfig).toEqual({
        app_environment: "mockserver",
        app_jurisdiction: "INTERNATIONAL",
        generated_app_headers: { Host: "betfair.com" },
        custom_app_environment: "http://0.0.0.0",
        custom_app_headers: "X-IP:1.1.1.1,X-COUNTRY-CODE:DK",
        custom_app_cookies: "ssoid=test",
        throttles_override: '{ "THROTTLE_A": { "isActive": true } }',
        disable_a11y_labels: false,
      });
    });
  });
});

describe("when getThrottlesSettings is called", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the value defined on the device settings", async () => {
    Storage.getItem = jest
      .fn()
      .mockResolvedValueOnce("mockserver")
      .mockResolvedValueOnce("INTERNATIONAL")
      .mockResolvedValueOnce("http://0.0.0.0")
      .mockResolvedValueOnce('{ "THROTTLE_A": { "isActive": true } }');
    await initSettings();

    expect(getThrottlesSettings()).toEqual('{ "THROTTLE_A": { "isActive": true } }');
  });
});

describe("when getCustomHeadersSettings is called", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the value defined on the device settings", async () => {
    Storage.getItem = jest
      .fn()
      .mockResolvedValueOnce("mockserver")
      .mockResolvedValueOnce("DENMARK")
      .mockResolvedValueOnce({ Host: "betfair.com" })
      .mockResolvedValueOnce("http://0.0.0.0")
      .mockResolvedValueOnce("X-IP:1.1.1.1,X-COUNTRY-CODE:DK");
    await initSettings();

    expect(getCustomHeadersSettings()).toEqual("X-IP:1.1.1.1,X-COUNTRY-CODE:DK");
  });
});
