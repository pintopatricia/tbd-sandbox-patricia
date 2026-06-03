import DeviceInfo from "react-native-device-info";
import {
  CountryCode,
  UserDetails,
  UserDetailsState,
} from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";

import { isVersionSupported } from "../version-helper";

/**
 * Current country codes which are supported by Google Play.
 */
export const STORE_JURISDICTIONS = [CountryCode.UNITED_KINGDOM, CountryCode.IRELAND];

/**
 * All states of force and suggest update feature.
 */
export enum AppUpdateStatus {
  Hidden,
  Suggest,
  Force,
  Unsupported,
}

/**
 * This function returns true if the OS version of the device is higher or equal than the minimum OS version which we support, otherwise returns false.
 * @param minOSVersion the minimum OS version supported.
 */
export const isPlatformSupported = (minOSVersion = ""): boolean => {
  const platformVersion = DeviceInfo.getSystemVersion();

  return isVersionSupported(platformVersion, minOSVersion);
};

/**
 * This function returns true, if the platform is iOS or if the user countryCode is supported by Play Store, otherwise returns false.
 * @param isAndroid the current running platform.
 * @param userDetailsState the user details to extract countryCode from.
 */
export const isStoreUpdate = (isAndroid: boolean, userDetailsState: UserDetailsState | undefined): boolean => {
  const { countryCode } = userDetailsState as UserDetails;

  return !isAndroid || STORE_JURISDICTIONS.some((jurisdiction) => jurisdiction === countryCode);
};
