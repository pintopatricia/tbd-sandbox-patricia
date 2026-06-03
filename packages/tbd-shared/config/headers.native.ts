import { Platform } from "react-native";

import {
  CountryCode,
  Jurisdiction,
  jurisdictionToCountryCodeMap,
  jurisdictionToTopLevelDomainMap,
} from "@ppb/tbd-store/config/Jurisdiction";

import Storage, { HeaderKey, SETTINGS_BUNDLE_KEYS, SettingsConfig } from "../helpers/storage.native";

import { Environment } from "./environments.native";

const countryIP: Record<CountryCode, string> = {
  [CountryCode.BRAZIL]: "45.7.23.255",
  [CountryCode.DENMARK]: "37.49.128.0",
  [CountryCode.ITALY]: "82.85.8.99",
  [CountryCode.ROMANIA]: "5.2.128.10",
  [CountryCode.SPAIN]: "5.45.160.5",
};

const buildGeneratedHeaders = (
  environment: Environment,
  jurisdiction: Jurisdiction,
): SettingsConfig[SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS] => {
  let generatedHeaders = {};

  if (jurisdiction !== "INTERNATIONAL") {
    const countryCode = jurisdictionToCountryCodeMap[jurisdiction];

    generatedHeaders = {
      ...generatedHeaders,
      [HeaderKey.X_COUNTRY_CODE]: countryCode,
      [HeaderKey.X_IP]: countryIP[countryCode],
    };
  }

  if (Platform.OS === "android" && environment === Environment.localhost) {
    generatedHeaders = {
      ...generatedHeaders,
      [HeaderKey.HOST]: `betfair.${jurisdictionToTopLevelDomainMap[jurisdiction]}`,
    };
  }

  return generatedHeaders;
};

export const setGeneratedHeaders = async (environment: Environment, jurisdiction: Jurisdiction): Promise<void> => {
  const generatedHeaders = buildGeneratedHeaders(environment, jurisdiction);

  try {
    await Storage.setItem(SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS, generatedHeaders);
  } catch (error) {
    console.error("Not able to set automatic header in storage", error);
  }
};
