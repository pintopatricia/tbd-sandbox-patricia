import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageModule } from "@ppb/tbd-store/modules/StorageModule.types";
import { StorageState } from "@ppb/tbd-store/helpers/storage";
import { Jurisdiction } from "@ppb/tbd-store/config/Jurisdiction";
import { Environment } from "../config/environments.native";

export enum HeaderKey {
  X_COUNTRY_CODE = "X-COUNTRY-CODE",
  X_IP = "X-IP",
  HOST = "Host",
}
export enum SETTINGS_BUNDLE_KEYS {
  APP_ENVIRONMENT = "app_environment",
  APP_JURISDICTION = "app_jurisdiction",
  GENERATED_APP_HEADERS = "generated_app_headers",
  CUSTOM_APP_ENVIRONMENT = "custom_app_environment",
  CUSTOM_APP_HEADERS = "custom_app_headers",
  CUSTOM_APP_COOKIES = "custom_app_cookies",
  THROTTLES_OVERRIDE = "throttles_override",
  DISABLE_A11Y_LABELS = "disable_a11y_labels",
}

export type ThrottlesOverride = { [id: string]: { isActive: boolean } };
export type GeneratedHeaders = { [key in HeaderKey]?: string };

export type SettingsConfig = {
  [SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT]: Environment | string;
  [SETTINGS_BUNDLE_KEYS.APP_JURISDICTION]: Jurisdiction;
  [SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS]: GeneratedHeaders;
  [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT]: string;
  [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS]: string;
  [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES]: string;
  [SETTINGS_BUNDLE_KEYS.THROTTLES_OVERRIDE]: ThrottlesOverride;
  [SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS]: boolean;
};

type NativeCommonStorageState = {
  wasNotificationNativePromptShown: boolean;
  wasNotificationsPromptShown: boolean;
  gamingSearchHistory: string[];
  sportsSearchHistory: string[];
};

export type NativeStorageState = StorageState & SettingsConfig & NativeCommonStorageState;

const Storage: StorageModule<NativeStorageState> = {
  async getItem(keyName) {
    const retrievedStorageValue = await AsyncStorage.getItem(keyName);
    try {
      return retrievedStorageValue ? JSON.parse(retrievedStorageValue) : undefined;
    } catch {
      return retrievedStorageValue || undefined;
    }
  },

  async multiGet(keyNames) {
    try {
      const resultsByKeyNamesOrder = await AsyncStorage.multiGet(keyNames);
      const keyNameMap = new Map(resultsByKeyNamesOrder.map(([key, value]) => [key, value ? JSON.parse(value) : null]));

      return Object.fromEntries(keyNameMap) as any;
    } catch (error) {
      console.error(error);
      return {};
    }
  },

  async setItem(keyName, keyValue) {
    await AsyncStorage.setItem(keyName, JSON.stringify(keyValue));
  },

  async removeItem(keyName) {
    await AsyncStorage.removeItem(keyName);
  },

  async clear() {
    await AsyncStorage.clear();
  },
};

export default Storage;
