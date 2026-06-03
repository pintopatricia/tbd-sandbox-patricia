import "react-native-url-polyfill/auto";
import { Buffer } from "buffer";
import { Platform } from "react-native";

// Required for hash resolution on OTA bundle applications
// This is a top-level import in the expo package
// Without this png, gifs and others won't get resolved in an OTA bundle
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
