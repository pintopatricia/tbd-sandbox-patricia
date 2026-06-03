import { timeDifferenceFromNowInMillis } from "../../helpers/dates";
import {
  hasLiveActivity,
  terminateLiveActivity,
  startLiveActivity,
  LiveActivityState,
  getLiveActivityState,
  isLiveActivityModuleAvailable,
} from "../../helpers/live-activities.native";
import { LiveActivityViewModelProps } from "./live-activities-mapper";

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

export const isStartTimeWithinTwoHours = (startTime?: string): boolean => {
  if (!startTime) {
    return false;
  }

  return timeDifferenceFromNowInMillis(startTime) <= TWO_HOURS_IN_MS;
};

export const getLiveActivityToggleDisabledFlag = (
  liveActivityViewModel: LiveActivityViewModelProps | null,
): boolean => {
  const liveActivityState = getLiveActivityState();

  if (liveActivityState === LiveActivityState.Unavailable) {
    return true;
  }

  if (!isStartTimeWithinTwoHours(liveActivityViewModel?.startTime)) {
    return true;
  }

  return false;
};

export const getLiveActivityToggleLabel = (
  liveActivitiesToggleDisabledDescription: string,
  liveActivitiesToggleMoreThanTwoHoursDescription: string,
  liveActivitiesToggleDescription: string,
  liveActivityViewModel: LiveActivityViewModelProps | null,
) => {
  const liveActivityState = getLiveActivityState();

  if (liveActivityState === LiveActivityState.Unavailable) {
    return liveActivitiesToggleDisabledDescription;
  }

  if (!isStartTimeWithinTwoHours(liveActivityViewModel?.startTime)) {
    return liveActivitiesToggleMoreThanTwoHoursDescription;
  }

  return liveActivitiesToggleDescription;
};

export const isLiveActivityEnabled = (
  isEventPageLiveActivitiesActive: boolean,
  liveActivityViewModel: LiveActivityViewModelProps | null,
): boolean => {
  return !!liveActivityViewModel && !!isEventPageLiveActivitiesActive && !!isLiveActivityModuleAvailable();
};

export const hasLiveActivitySubscription = (eventId: string, callback: (hasLiveActivity: boolean) => void) => {
  hasLiveActivity(eventId, callback);
};

export const onLiveActivityToggleUpdate = async (
  isToggleOn: boolean,
  liveActivityViewModel: LiveActivityViewModelProps | null,
  callback: ({ isSubscribed, pushToken }: { isSubscribed: boolean; pushToken?: string }) => void,
) => {
  if (!liveActivityViewModel) {
    return;
  }

  const { eventId, startTime } = liveActivityViewModel; // Destructure to ensure all required properties are accessed and available

  if (isToggleOn) {
    if (!isStartTimeWithinTwoHours(startTime)) {
      callback({ isSubscribed: false });
      return;
    }

    await startLiveActivity(eventId, liveActivityViewModel, (pushToken) => {
      hasLiveActivitySubscription(eventId, (hasLiveActivity: boolean) => {
        callback({ isSubscribed: hasLiveActivity, pushToken });
      });
    });
  } else {
    await terminateLiveActivity(eventId, (pushToken) => {
      hasLiveActivitySubscription(eventId, (hasLiveActivity: boolean) => {
        callback({ isSubscribed: hasLiveActivity, pushToken });
      });
    });
  }
};
