import { Platform } from "react-native";
import { Jurisdiction } from "@ppb/tbd-store/config/Jurisdiction";
import { Jurisdiction as JurisdictionMap } from "@ppb/tbd-store/state/constants";
import Storage, { SETTINGS_BUNDLE_KEYS, SettingsConfig, ThrottlesOverride } from "../helpers/storage.native";
import appConfiguration from "./app-configuration.native";

export type KeySetting = {
  settingKey: SETTINGS_BUNDLE_KEYS;
  settingValue: any;
};

type Loader = (settingKey: SETTINGS_BUNDLE_KEYS) => Promise<KeySetting>;

// Device settings values, they are initialized with default values
export const settingsConfig: SettingsConfig = {
  [SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT]: appConfiguration.appConfig?.TBDN_DEFAULT_ENVIRONMENT || "",
  [SETTINGS_BUNDLE_KEYS.APP_JURISDICTION]: JurisdictionMap.INTERNATIONAL,
  [SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS]: {},
  [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT]: appConfiguration.appConfig?.TBDN_INITIAL_CUSTOM_ENVIRONMENT || "",
  [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS]: "",
  [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES]: appConfiguration.appConfig?.TBDN_INITIAL_COOKIES || "",
  [SETTINGS_BUNDLE_KEYS.THROTTLES_OVERRIDE]: {},
  [SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS]: true,
};

/**
 * Update settings from settings bundle defined by the user.
 * Not available in production
 */
const updateSettingsConfig = (settings: KeySetting[]): void => {
  settings.forEach((setting: KeySetting) => {
    if (
      Object.prototype.hasOwnProperty.call(settingsConfig, setting.settingKey) &&
      setting.settingValue !== undefined
    ) {
      switch (setting.settingKey) {
        case SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT:
          if ((setting.settingValue as string).length > 0) {
            settingsConfig[SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT] = setting.settingValue as string;
          }
          break;
        case SETTINGS_BUNDLE_KEYS.APP_JURISDICTION:
          if ((setting.settingValue as Jurisdiction).length > 0) {
            settingsConfig[SETTINGS_BUNDLE_KEYS.APP_JURISDICTION] = setting.settingValue as Jurisdiction;
          }
          break;
        case SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS:
          settingsConfig[SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS] =
            setting.settingValue as SettingsConfig[SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS];
          break;
        case SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS:
        case SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT:
        case SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES:
          settingsConfig[setting.settingKey] = setting.settingValue as string;
          break;
        case SETTINGS_BUNDLE_KEYS.THROTTLES_OVERRIDE:
          settingsConfig[SETTINGS_BUNDLE_KEYS.THROTTLES_OVERRIDE] = setting.settingValue as ThrottlesOverride;
          break;
        case SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS:
          settingsConfig[SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS] = setting.settingValue as boolean;
          break;

        default:
          break;
      }
    }
  });
};

const AsyncStorageLoader: Loader = async (settingKey) => {
  const retrievedStorageValue = await Storage.getItem(settingKey);
  let settingValue = retrievedStorageValue;

  if (settingValue === undefined) {
    settingValue = settingsConfig[settingKey];

    await Storage.setItem(settingKey, settingValue);
  }

  return { settingKey, settingValue };
};

type PlatformLoaders = {
  [platform in Platform["OS"]]: platform extends "android" | "ios"
    ? {
        [key in SETTINGS_BUNDLE_KEYS]: Loader;
      }
    : undefined;
};

const LOADERS: PlatformLoaders = {
  android: {
    [SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.APP_JURISDICTION]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.THROTTLES_OVERRIDE]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS]: AsyncStorageLoader,
  },
  ios: {
    [SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.APP_JURISDICTION]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.THROTTLES_OVERRIDE]: AsyncStorageLoader,
    [SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS]: AsyncStorageLoader,
  },
  windows: undefined,
  macos: undefined,
  web: undefined,
};

/**
 * Retrieves all throttles that were loaded from storage
 *
 * @return Promise<KeySetting[]>
 */
export const getThrottlesSettings = (): SettingsConfig["throttles_override"] =>
  settingsConfig[SETTINGS_BUNDLE_KEYS.THROTTLES_OVERRIDE];

export const getCustomHeadersSettings = (): SettingsConfig["custom_app_headers"] =>
  settingsConfig[SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS] || "";

/**
 * Call native module to load bundleKey
 *
 * @param SETTINGS_BUNDLE_KEYS[]
 *
 * @return Promise<KeySetting[]>
 */
const loadSettingBundle = (bundleKey: SETTINGS_BUNDLE_KEYS[]): Promise<KeySetting[]> => {
  const allPromises = bundleKey.map((settingKey) => {
    const platformLoader = LOADERS[Platform.OS];

    if (!platformLoader) {
      return Promise.resolve({ settingKey, settingValue: "" });
    }

    return platformLoader[settingKey](settingKey);
  });

  return Promise.all(allPromises);
};

/**
 * Loading custom settings for in-house builds.
 *
 * @return Promise<KeySetting[]>
 */
export const loadSettings = (): Promise<KeySetting[]> =>
  loadSettingBundle([
    SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT,
    SETTINGS_BUNDLE_KEYS.APP_JURISDICTION,
    SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS,
    SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT,
    SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS,
    SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES,
    SETTINGS_BUNDLE_KEYS.THROTTLES_OVERRIDE,
    SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS,
  ]);

/**
 * Initialize device settings.
 *
 * @return Promise<EndpointsConfig>
 */
export const initSettings = async (): Promise<void> => {
  // if the environment is production we do not have settings available
  if (appConfiguration.appConfig?.TBDN_RELEASE_MODE !== "production") {
    // Get settings defined by user
    const settings: KeySetting[] = await loadSettings();
    // Update config with settings set by the user on the device

    updateSettingsConfig(settings);
  }
};
