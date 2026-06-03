import { EmitterSubscription, NativeEventEmitter, NativeModules } from "react-native";
import DeviceInfo from "react-native-device-info";
import { isVersionSupported } from "./version-helper";
import { LiveActivityEvent } from "@ppb/tbd-store/state/entities/notifications/Notifications";

const ScoresLiveActivityModule = NativeModules?.ScoresLiveActivityModule;
const ScoresLiveActivityEventEmitter = NativeModules?.ScoresLiveActivityEventEmitter;

const liveActivityEvents = ScoresLiveActivityEventEmitter
  ? new NativeEventEmitter(ScoresLiveActivityEventEmitter)
  : null;

let onLiveActivityEndedSubscription: EmitterSubscription | null = null;

/**
 * Logs messages to the console only in development mode to avoid cluttering production logs.
 * @param message - The message to log
 * @param details - Optional additional details to log
 */
const log = (message: string, details?: any): void => {
  if (__DEV__) {
    console.log(message, details);
  }
};

/**
 * Logs a standardized message indicating that the ScoresLiveActivityModule was not found, along with the function name for easier debugging.
 * @param functionName name of the function where the module was expected to be found
 */
const logModuleNotFound = (functionName: string): void => {
  log(`LiveActivitiesModule: module not found when performing ${functionName} function.`);
};

/**
 * Safely check if the ScoresLiveActivityModule is available
 */
export const isLiveActivityModuleAvailable = (): boolean => {
  return !!ScoresLiveActivityModule;
};

/**
 * Check if a live activity already exists for a given eventId.
 * @param eventId - The eventId to check
 * @param callback - A callback function that receives a boolean indicating whether a live activity exists for the eventId
 */
export const hasLiveActivity = async (eventId: string | undefined, callback: (hasLiveActivity: boolean) => void) => {
  try {
    if (!isLiveActivityModuleAvailable()) {
      logModuleNotFound("hasLiveActivity");
      callback(false);
      return;
    }

    if (!eventId) {
      log("Error checking live activity existence: eventId is missing.");
      callback(false);
      return;
    }

    await ScoresLiveActivityModule.hasLiveActivity(eventId, async (liveActivityScheduled: boolean) => {
      log(`Live activity existence check for event ${eventId}:`, liveActivityScheduled);
      callback(liveActivityScheduled);
    });
  } catch (error) {
    log(`Error checking live activity existence for event ${eventId}:`, error);
    callback(false);
    return;
  }
};

/**
 * Start a live activity for a given event with the provided initial payload.
 * @param eventId - The eventId for the live activity
 * @param payload - The payload containing activity data (teams, scores, etc.)
 * @param callback - A callback function that receives the push token of the started activity, or undefined if starting failed
 */
export const startLiveActivity = async (
  eventId: string | undefined,
  payload: Record<string, any>,
  callback: (pushToken: string | undefined) => void,
) => {
  try {
    if (!isLiveActivityModuleAvailable()) {
      logModuleNotFound("startLiveActivity");
      callback(undefined);
      return;
    }

    if (!eventId) {
      log("Error starting live activity: eventId is missing.");
      callback(undefined);
      return;
    }

    const pushToken = await ScoresLiveActivityModule.startScoresLiveActivity(eventId, payload);
    log(`Live activity started for event ${eventId} with push token:`, pushToken);
    callback(pushToken?.pushToken);
  } catch (error) {
    log(`Error starting live activity for event ${eventId}:`, error);
    callback(undefined);
  }
};

/**
 * Terminate a live activity for a given event
 * @param eventId - The event ID whose live activity should be terminated
 * @param callback - A callback function that receives the push token of the terminated activity, or undefined if termination failed
 */
export const terminateLiveActivity = async (
  eventId: string | undefined,
  callback: (pushToken: string | undefined) => void,
) => {
  try {
    if (!isLiveActivityModuleAvailable()) {
      logModuleNotFound("terminateLiveActivity");
      callback(undefined);
      return;
    }

    if (!eventId) {
      log("Error terminating live activity: eventId is missing.");
      callback(undefined);
      return;
    }

    await ScoresLiveActivityModule.terminateScoresLiveActivity(
      eventId,
      async (terminatedPushToken: string | undefined) => {
        log(`Live activity terminated for event ${eventId} with push token:`, terminatedPushToken);
        callback(terminatedPushToken);
      },
    );
  } catch (error) {
    log(`Error terminating live activity for event ${eventId}:`, error);
    callback(undefined);
  }
};

export enum LiveActivityState {
  Unavailable = "UNAVAILABLE",
  Available = "AVAILABLE",
  AvailableWithScheduling = "AVAILABLE_WITH_SCHEDULING",
}

/**
 * Determines Live Activity behavior
 */
export function getLiveActivityState(): LiveActivityState {
  const platformVersion = DeviceInfo.getSystemVersion();

  if (isVersionSupported(platformVersion, "26.0.0")) {
    return LiveActivityState.AvailableWithScheduling;
  }

  if (isVersionSupported(platformVersion, "16.1.0")) {
    return LiveActivityState.Available;
  }

  return LiveActivityState.Unavailable;
}

/**
 * Returns `{ eventId, pushToken }` pairs for Live Activities that ended while the
 * app was closed. The native side detects these at module init (by diffing iOS's
 * active-activity list against the stored data store) and queues them. This call
 * drains the queue, so a second invocation returns an empty array.
 *
 * Typical use: call once on app startup to notify the server which subscriptions
 * to invalidate.
 * @param callback - Receives the array of finished activity pairs (empty if none)
 */
export const getFinishedPushTokens = async (callback: (finishedLiveActivityEvents: LiveActivityEvent[]) => void) => {
  try {
    if (!isLiveActivityModuleAvailable()) {
      logModuleNotFound("getFinishedPushTokens");
      callback([]);
      return;
    }

    await ScoresLiveActivityModule.getFinishedPushTokens(async (finishedLiveActivityEvents: LiveActivityEvent[]) => {
      log(`Consumed ${finishedLiveActivityEvents?.length ?? 0} pending ended live activities`);
      callback(finishedLiveActivityEvents ?? []);
    });
  } catch (error) {
    log(`Error consuming pending ended live activities:`, error);
    callback([]);
  }
};

/**
 * Subscribe to the native event fired when a Live Activity ends or is dismissed
 * (either programmatically via `terminateLiveActivity` or by the user/system).
 * Only fires when a push token is associated with the activity.
 * @param callback - Receives the `{ eventId, pushToken }` of the Live Activity that ended
 * @returns A subscription with `.remove()` — call it on cleanup (e.g. useEffect return)
 */
export const onLiveActivityEnded = (callback: (finishedLiveActivityEvent: LiveActivityEvent) => void) => {
  if (!liveActivityEvents) {
    logModuleNotFound("onLiveActivityEnded");
    return { remove: () => {} };
  }

  if (onLiveActivityEndedSubscription) {
    log("Removing existing onLiveActivityEnded listener before adding a new one");
    onLiveActivityEndedSubscription.remove();
    onLiveActivityEndedSubscription = null;
  }

  onLiveActivityEndedSubscription = liveActivityEvents.addListener("onLiveActivityEnded", (body: LiveActivityEvent) => {
    log(`Live activity ended for event ${body.eventId} with push token: ${body.pushToken}`);
    callback(body);
  });

  return onLiveActivityEndedSubscription;
};
