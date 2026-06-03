import "react-native-url-polyfill/auto";
import { Buffer } from "buffer";
import { Platform } from "react-native";
// expo-asset must be imported before any other expo module to ensure hash resolution works
import "expo-asset";
/**
 * Polyfill for Intl NumberFormat.formatToParts and DateTimeFormat timezones
 * iOS <=12 doesn't support Intl.NumberFormat.formatToParts
 * Intl polyfill don't support DateTimeFormat timezones
 */
import applyFormatToPartsPolyfill from "@ppb/tbd-shared/polyfills/format-to-parts";

global.Buffer = Buffer;

/**
 * Using date-time-format-timezone polyfill because iOS doesn't support all CET timezones.
 * https://gist.github.com/mteece/80fff3329074cf90d7991e55f4fc8de4
 */
if (Platform.OS === "ios") {
  global.Intl.DateTimeFormat = require("date-time-format-timezone");
}

applyFormatToPartsPolyfill();
