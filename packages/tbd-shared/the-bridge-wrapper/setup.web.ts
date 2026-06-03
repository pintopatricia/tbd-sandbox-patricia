import {
  HostCommandsNavigateCommand,
  HostEventsPersonalDetailsUpdatedEvent,
  HostEventsWalletUpdatedEvent,
  MessageBus,
  TheBridgeSBKApi,
  APIVersion,
} from "@flutter-global/the-bridge";
import emit from "../event-broker/event-emitter";

/**
 * Checks if two semantic major version strings match
 */
function majorVersionsMatch(versionA: string, versionB: string): boolean {
  const majorVersionRegex = /^(\d+)\./;

  const matchA = versionA.match(majorVersionRegex);
  const matchB = versionB.match(majorVersionRegex);

  if (!matchA || !matchB) {
    return false;
  }

  return matchA[1] === matchB[1];
}

/**
 * Sets up The Bridge wrapper comms layer
 */
export default function setupTheBridge() {
  const { webWrappedExperience } = window.__TBD_CLIENT_CONTEXT__ ?? {};
  const { bridgeAPIVersion } = window.__TBD_CLIENT_CONTEXT__?.wrapper ?? {};

  if (webWrappedExperience && bridgeAPIVersion) {
    // Checks if TheBridge API major versions match, between the Host UserAgent and TBD's TheBridge lib.
    if (!majorVersionsMatch(bridgeAPIVersion, APIVersion)) {
      const noticeError = window.newrelic?.noticeError;

      if (noticeError) {
        noticeError(
          new Error(
            `TheBridge major versions don't match. Host UA (${bridgeAPIVersion})/TheBridge lib (${APIVersion}).`,
          ),
        );
      }

      return;
    }

    const bus = new MessageBus(window.parent);
    const bridge = TheBridgeSBKApi.createInstance(bus);

    bridge.onWalletUpdated((event: HostEventsWalletUpdatedEvent) => {
      emit("@@THE_BRIDGE/HOST_WALLET_UPDATED", event.payload);
    });

    bridge.onPersonalDetailsUpdated((event: HostEventsPersonalDetailsUpdatedEvent) => {
      emit("@@THE_BRIDGE/HOST_PERSONAL_DETAILS_UPDATED", event.payload);
    });

    bridge.onNavigate((event: HostCommandsNavigateCommand) => {
      emit("@@THE_BRIDGE/HOST_NAVIGATE", event.payload);
    });
  }
}
