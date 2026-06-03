import { getActiveThrottles } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { AppContextData } from "@ppb/tbd-store/clients/app-context/app-context-client";
import { getCustomUserAgent } from "./user-agent.native";
import { getTotalMemorySync } from "react-native-device-info";
import { getNetworkAttributes } from "./network-info.native";

type OtelAttributes = { [key: string]: string | number | boolean | undefined };

/**
 * This method will set all the utility custom attributes to OTEL
 *
 * @param entities The entities state from AppContext init
 */
export function getOtelCustomAttributes(entities: AppContextData["initialState"]["entities"]): OtelAttributes {
  const { userdetails, brandSettings, experiments, throttles } = entities;

  const attributes: OtelAttributes = {
    customUserAgent: getCustomUserAgent(),
    customLoggedIn: userdetails.loggedIn,
    customThrottles: getActiveThrottles(throttles).join(","),
    customExperiments: Object.keys(experiments ?? {}).join(","),
    customDeviceMemory: getTotalMemorySync(),
    customBrandSettings: Object.keys(brandSettings).join(","),
    customAccountId: String(userdetails.accountId),
  };

  return attributes;
}

/**
 * Get network-related OTEL custom attributes
 * This is async because NetInfo.fetch() returns a Promise
 *
 * @returns Promise<OtelAttributes> Network attributes for telemetry
 */
export function getOtelNetworkAttributes(): Promise<OtelAttributes> {
  return getNetworkAttributes().catch((error) => {
    console.error("Failed to get network attributes:", error);
    return {};
  });
}
