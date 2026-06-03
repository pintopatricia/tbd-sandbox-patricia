import type { StorageModule } from "@ppb/tbd-store";
import { setAppCustomHeaders } from "@ppb/tbd-store/services/client-factory";
import { getCustomHeadersSettings } from "../config/settings-utils.native";
import { createHeaderParser } from "./parsers";
import { type NativeStorageState, SETTINGS_BUNDLE_KEYS } from "./storage.native";

const parseHeaders = createHeaderParser();

export const setCustomHeaders = async (storage: StorageModule<NativeStorageState>): Promise<void> => {
  const customHeadersSettings = getCustomHeadersSettings();
  const generatedHeadersSettings = (await storage.getItem(SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS)) ?? {};

  const customHeaders = Object.fromEntries(parseHeaders(customHeadersSettings));
  const headersSettings = {
    ...generatedHeadersSettings,
    ...customHeaders,
  };

  if (Object.keys(headersSettings).length > 0) {
    setAppCustomHeaders(headersSettings);
  }
};
