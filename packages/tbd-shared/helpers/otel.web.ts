import { getActiveThrottles } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { isOnlineUserDetails } from "@ppb/tbd-store";

import { getUserAgent } from "./user-agent.web";
import { getNetworkAttributes } from "./network-info.web";

/**
 * Safely get network attributes for telemetry
 * Returns empty object if Network Information API is unavailable or errors
 */
function getSafeNetworkAttributes(): { [key: string]: string | number | boolean | undefined } {
  try {
    return getNetworkAttributes();
  } catch (error) {
    console.error("Failed to get network attributes:", error);
    return {};
  }
}

/**
 * This method will set all the utility custom attributes to OTEL
 *
 * @param preloadedState The preloaded state with all throttles and experiments
 */
export function setOtelCustomAttributes(preloadedState: ApplicationState): void {
  const attributes: { [key: string]: string | number | boolean | undefined } = {
    customUserAgent: getUserAgent(),
    customLoggedIn: preloadedState.entities.userdetails.loggedIn,
    customThrottles: getActiveThrottles(preloadedState.entities.throttles).join(","),
    customExperiments: Object.keys(preloadedState.entities.experiments ?? {}).join(","),
    ...getSafeNetworkAttributes(),
  };

  if (isOnlineUserDetails(preloadedState.entities.userdetails)) {
    attributes.customAccountId = preloadedState.entities.userdetails.accountId;
  }

  if (preloadedState.entities.brandSettings) {
    attributes.customBrandSettings = Object.keys(preloadedState.entities.brandSettings).join(",");
  }

  // Number of CPU Cores
  if (window.navigator.hardwareConcurrency) {
    attributes.customHardwareConcurrency = window.navigator.hardwareConcurrency;
  }

  // Device memory (RAM)
  if (window.navigator.deviceMemory) {
    attributes.customDeviceMemory = window.navigator.deviceMemory;
  }

  window.SplunkRum?.setGlobalAttributes(attributes);
}
