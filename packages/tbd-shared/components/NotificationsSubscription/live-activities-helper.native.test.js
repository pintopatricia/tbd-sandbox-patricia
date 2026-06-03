import {
  isStartTimeWithinTwoHours,
  getLiveActivityToggleDisabledFlag,
  getLiveActivityToggleLabel,
  isLiveActivityEnabled,
  hasLiveActivitySubscription,
  onLiveActivityToggleUpdate,
} from "./live-activities-helper.native";
import {
  hasLiveActivity,
  terminateLiveActivity,
  startLiveActivity,
  LiveActivityState,
  getLiveActivityState,
  isLiveActivityModuleAvailable,
} from "../../helpers/live-activities.native";
import { timeDifferenceFromNowInMillis } from "../../helpers/dates";

jest.mock("../../helpers/dates", () => ({
  timeDifferenceFromNowInMillis: jest.fn(),
}));

jest.mock("../../helpers/live-activities.native", () => ({
  hasLiveActivity: jest.fn(),
  terminateLiveActivity: jest.fn(),
  startLiveActivity: jest.fn(),
  isLiveActivityModuleAvailable: jest.fn(),
  getLiveActivityState: jest.fn(),
  LiveActivityState: {
    Unavailable: "UNAVAILABLE",
    Available: "AVAILABLE",
    AvailableWithScheduling: "AVAILABLE_WITH_SCHEDULING",
  },
}));

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
const liveActivityViewModel = { eventId: "event-1", startTime: "2026-05-21T15:00:00Z" };

describe("isStartTimeWithinTwoHours", () => {
  beforeEach(jest.resetAllMocks);

  it("should return false when startTime is undefined", () => {
    expect(isStartTimeWithinTwoHours(undefined)).toBe(false);
    expect(timeDifferenceFromNowInMillis).not.toHaveBeenCalled();
  });

  it("should return true when the time difference is within two hours", () => {
    timeDifferenceFromNowInMillis.mockReturnValueOnce(TWO_HOURS_IN_MS - 1);
    expect(isStartTimeWithinTwoHours("2026-05-21T15:00:00Z")).toBe(true);
  });

  it("should return true when the time difference equals two hours", () => {
    timeDifferenceFromNowInMillis.mockReturnValueOnce(TWO_HOURS_IN_MS);
    expect(isStartTimeWithinTwoHours("2026-05-21T15:00:00Z")).toBe(true);
  });

  it("should return false when the time difference exceeds two hours", () => {
    timeDifferenceFromNowInMillis.mockReturnValueOnce(TWO_HOURS_IN_MS + 1);
    expect(isStartTimeWithinTwoHours("2026-05-21T15:00:00Z")).toBe(false);
  });
});

describe("getLiveActivityToggleDisabledFlag", () => {
  beforeEach(jest.resetAllMocks);

  it("should return true when live activity is unavailable", () => {
    getLiveActivityState.mockReturnValueOnce(LiveActivityState.Unavailable);
    expect(getLiveActivityToggleDisabledFlag(liveActivityViewModel)).toBe(true);
  });

  it("should return true when start time is not within two hours", () => {
    getLiveActivityState.mockReturnValueOnce(LiveActivityState.Available);
    timeDifferenceFromNowInMillis.mockReturnValueOnce(TWO_HOURS_IN_MS + 1);
    expect(getLiveActivityToggleDisabledFlag(liveActivityViewModel)).toBe(true);
  });

  it("should return false when live activity is available and start time is within two hours", () => {
    getLiveActivityState.mockReturnValueOnce(LiveActivityState.Available);
    timeDifferenceFromNowInMillis.mockReturnValueOnce(TWO_HOURS_IN_MS - 1);
    expect(getLiveActivityToggleDisabledFlag(liveActivityViewModel)).toBe(false);
  });
});

describe("getLiveActivityToggleLabel", () => {
  const disabledLabel = "disabled";
  const moreThanTwoHoursLabel = "more than two hours";
  const defaultLabel = "default";

  beforeEach(jest.resetAllMocks);

  it("should return the disabled label when live activity is unavailable", () => {
    getLiveActivityState.mockReturnValueOnce(LiveActivityState.Unavailable);
    expect(getLiveActivityToggleLabel(disabledLabel, moreThanTwoHoursLabel, defaultLabel, liveActivityViewModel)).toBe(
      disabledLabel,
    );
  });

  it("should return the more-than-two-hours label when start time is more than two hours away", () => {
    getLiveActivityState.mockReturnValueOnce(LiveActivityState.Available);
    timeDifferenceFromNowInMillis.mockReturnValueOnce(TWO_HOURS_IN_MS + 1);
    expect(getLiveActivityToggleLabel(disabledLabel, moreThanTwoHoursLabel, defaultLabel, liveActivityViewModel)).toBe(
      moreThanTwoHoursLabel,
    );
  });

  it("should return the default label when live activity is available and start time is within two hours", () => {
    getLiveActivityState.mockReturnValueOnce(LiveActivityState.Available);
    timeDifferenceFromNowInMillis.mockReturnValueOnce(TWO_HOURS_IN_MS - 1);
    expect(getLiveActivityToggleLabel(disabledLabel, moreThanTwoHoursLabel, defaultLabel, liveActivityViewModel)).toBe(
      defaultLabel,
    );
  });
});

describe("isLiveActivityEnabled", () => {
  beforeEach(jest.resetAllMocks);

  it("should return true when all three conditions are met", () => {
    isLiveActivityModuleAvailable.mockReturnValueOnce(true);
    expect(isLiveActivityEnabled(true, liveActivityViewModel)).toBe(true);
  });

  it("should return false when the view model is null", () => {
    isLiveActivityModuleAvailable.mockReturnValueOnce(true);
    expect(isLiveActivityEnabled(true, null)).toBe(false);
  });

  it("should return false when the event-page flag is false", () => {
    isLiveActivityModuleAvailable.mockReturnValueOnce(true);
    expect(isLiveActivityEnabled(false, liveActivityViewModel)).toBe(false);
  });

  it("should return false when the native module is unavailable", () => {
    isLiveActivityModuleAvailable.mockReturnValueOnce(false);
    expect(isLiveActivityEnabled(true, liveActivityViewModel)).toBe(false);
  });
});

describe("hasLiveActivitySubscription", () => {
  beforeEach(jest.resetAllMocks);

  it("should forward the call to hasLiveActivity", () => {
    const callback = jest.fn();
    hasLiveActivitySubscription("event-1", callback);
    expect(hasLiveActivity).toHaveBeenCalledWith("event-1", callback);
  });
});

describe("onLiveActivityToggleUpdate", () => {
  beforeEach(jest.resetAllMocks);

  it("should do nothing when the view model is null", async () => {
    const callback = jest.fn();
    await onLiveActivityToggleUpdate(true, null, callback);
    expect(startLiveActivity).not.toHaveBeenCalled();
    expect(terminateLiveActivity).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it("should invoke the callback with isSubscribed=false when the start time is too far when toggled on", async () => {
    timeDifferenceFromNowInMillis.mockReturnValueOnce(TWO_HOURS_IN_MS + 1);
    const callback = jest.fn();

    await onLiveActivityToggleUpdate(true, liveActivityViewModel, callback);

    expect(callback).toHaveBeenCalledWith({ isSubscribed: false });
    expect(startLiveActivity).not.toHaveBeenCalled();
  });

  it("should start the live activity when toggled on and the start time is within two hours", async () => {
    timeDifferenceFromNowInMillis.mockReturnValueOnce(TWO_HOURS_IN_MS - 1);
    startLiveActivity.mockImplementation(async (_eventId, _payload, cb) => cb("push-token-abc"));
    hasLiveActivity.mockImplementation((_eventId, cb) => cb(true));
    const callback = jest.fn();

    await onLiveActivityToggleUpdate(true, liveActivityViewModel, callback);

    expect(startLiveActivity).toHaveBeenCalledWith(
      liveActivityViewModel.eventId,
      liveActivityViewModel,
      expect.any(Function),
    );
    expect(callback).toHaveBeenCalledWith({ isSubscribed: true, pushToken: "push-token-abc" });
  });

  it("should terminate the live activity when toggled off", async () => {
    terminateLiveActivity.mockImplementation(async (_eventId, cb) => cb("push-token-xyz"));
    hasLiveActivity.mockImplementation((_eventId, cb) => cb(false));
    const callback = jest.fn();

    await onLiveActivityToggleUpdate(false, liveActivityViewModel, callback);

    expect(terminateLiveActivity).toHaveBeenCalledWith(liveActivityViewModel.eventId, expect.any(Function));
    expect(callback).toHaveBeenCalledWith({ isSubscribed: false, pushToken: "push-token-xyz" });
  });
});
