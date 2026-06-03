import { getActiveThrottles } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

import { getUserAgent } from "./user-agent.web";

/**
 * This method will set all the utility custom attributes to new relic
 *
 * @param preloadedState The preloaded state with all throttles and experiments
 */
export function setNewRelicCustomAttributes(preloadedState: ApplicationState): void {
  // Raw UserAgent
  window.newrelic?.setCustomAttribute("customUserAgent", getUserAgent());

  // Logged in state
  window.newrelic?.setCustomAttribute("customLoggedIn", `${preloadedState.entities.userdetails.loggedIn}`);

  // Throttles
  window.newrelic?.setCustomAttribute(
    "customThrottles",
    getActiveThrottles(preloadedState.entities.throttles).join(","),
    true,
  );

  // Experiments
  window.newrelic?.setCustomAttribute(
    "customExperiments",
    Object.keys(preloadedState.entities.experiments).join(","),
    true,
  );

  // Number of CPU Cores
  if (window.navigator.hardwareConcurrency) {
    window.newrelic?.setCustomAttribute("customHardwareConcurrency", window.navigator.hardwareConcurrency);
  }

  // Device memory (RAM)
  if (window.navigator.deviceMemory) {
    window.newrelic?.setCustomAttribute("customDeviceMemory", window.navigator.deviceMemory);
  }
}
