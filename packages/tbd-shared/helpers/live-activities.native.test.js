import DeviceInfo from "react-native-device-info";
import { NativeModules } from "react-native";

import {
  getLiveActivityState,
  LiveActivityState,
  isLiveActivityModuleAvailable,
  hasLiveActivity,
  startLiveActivity,
  terminateLiveActivity,
  getFinishedPushTokens,
  onLiveActivityEnded,
} from "./live-activities.native.ts";

const mockAddListener = jest.fn();
const mockRemove = jest.fn();

jest.mock("react-native-device-info", () => ({
  getSystemVersion: jest.fn(() => "26.0"),
}));

jest.mock("react-native", () => {
  const addListenerImpl = (...args) => {
    const subscription = { remove: jest.fn() };
    mockAddListener(...args);
    mockAddListener.mock.results[mockAddListener.mock.results.length - 1].value = subscription;
    return subscription;
  };

  return {
    NativeModules: {
      ScoresLiveActivityModule: {
        hasLiveActivity: jest.fn(),
        startScoresLiveActivity: jest.fn(),
        terminateScoresLiveActivity: jest.fn(),
        getFinishedPushTokens: jest.fn(),
      },
      ScoresLiveActivityEventEmitter: {},
    },
    NativeEventEmitter: jest.fn().mockImplementation(() => ({
      addListener: addListenerImpl,
    })),
  };
});

describe("isLiveActivityModuleAvailable", () => {
  it("should return true when the native module is available", () => {
    expect(isLiveActivityModuleAvailable()).toBe(true);
  });
});

describe("hasLiveActivity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should invoke the callback with the native result", async () => {
    NativeModules.ScoresLiveActivityModule.hasLiveActivity.mockImplementation((_id, cb) => cb(true));
    const callback = jest.fn();

    await hasLiveActivity("event-1", callback);

    expect(NativeModules.ScoresLiveActivityModule.hasLiveActivity).toHaveBeenCalledWith(
      "event-1",
      expect.any(Function),
    );
    expect(callback).toHaveBeenCalledWith(true);
  });

  it("should invoke the callback with false when eventId is missing", async () => {
    const callback = jest.fn();

    await hasLiveActivity(undefined, callback);

    expect(callback).toHaveBeenCalledWith(false);
    expect(NativeModules.ScoresLiveActivityModule.hasLiveActivity).not.toHaveBeenCalled();
  });
});

describe("startLiveActivity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should resolve the push token via the callback", async () => {
    NativeModules.ScoresLiveActivityModule.startScoresLiveActivity.mockImplementationOnce(() =>
      Promise.resolve({ pushToken: "push-token-abc" }),
    );
    const callback = jest.fn();

    await startLiveActivity("event-1", { foo: "bar" }, callback);

    expect(NativeModules.ScoresLiveActivityModule.startScoresLiveActivity).toHaveBeenCalledWith("event-1", {
      foo: "bar",
    });
    expect(callback).toHaveBeenCalledWith("push-token-abc");
  });

  it("should invoke the callback with undefined when eventId is missing", async () => {
    const callback = jest.fn();

    await startLiveActivity(undefined, {}, callback);

    expect(callback).toHaveBeenCalledWith(undefined);
    expect(NativeModules.ScoresLiveActivityModule.startScoresLiveActivity).not.toHaveBeenCalled();
  });

  it("should invoke the callback with undefined when the native call rejects", async () => {
    NativeModules.ScoresLiveActivityModule.startScoresLiveActivity.mockRejectedValue(new Error("boom"));
    const callback = jest.fn();

    await startLiveActivity("event-1", {}, callback);

    expect(callback).toHaveBeenCalledWith(undefined);
  });
});

describe("terminateLiveActivity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should invoke the callback with the terminated push token", async () => {
    NativeModules.ScoresLiveActivityModule.terminateScoresLiveActivity.mockImplementation((_id, cb) =>
      cb("push-token-xyz"),
    );
    const callback = jest.fn();

    await terminateLiveActivity("event-1", callback);

    expect(NativeModules.ScoresLiveActivityModule.terminateScoresLiveActivity).toHaveBeenCalledWith(
      "event-1",
      expect.any(Function),
    );
    expect(callback).toHaveBeenCalledWith("push-token-xyz");
  });

  it("should invoke the callback with undefined when eventId is missing", async () => {
    const callback = jest.fn();

    await terminateLiveActivity(undefined, callback);

    expect(callback).toHaveBeenCalledWith(undefined);
    expect(NativeModules.ScoresLiveActivityModule.terminateScoresLiveActivity).not.toHaveBeenCalled();
  });
});

describe("getFinishedPushTokens", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should invoke the callback with the array of finished live activity events", async () => {
    const finished = [
      { eventId: "event-1", pushToken: "token-1" },
      { eventId: "event-2", pushToken: "token-2" },
    ];
    NativeModules.ScoresLiveActivityModule.getFinishedPushTokens.mockImplementation((cb) => cb(finished));
    const callback = jest.fn();

    await getFinishedPushTokens(callback);

    expect(callback).toHaveBeenCalledWith(finished);
  });

  it("should invoke the callback with an empty array when the native call returns nullish", async () => {
    NativeModules.ScoresLiveActivityModule.getFinishedPushTokens.mockImplementation((cb) => cb(undefined));
    const callback = jest.fn();

    await getFinishedPushTokens(callback);

    expect(callback).toHaveBeenCalledWith([]);
  });

  it("should invoke the callback with an empty array when the native call rejects", async () => {
    NativeModules.ScoresLiveActivityModule.getFinishedPushTokens.mockRejectedValue(new Error("boom"));
    const callback = jest.fn();

    await getFinishedPushTokens(callback);

    expect(callback).toHaveBeenCalledWith([]);
  });
});

describe("onLiveActivityEnded", () => {
  beforeEach(() => {
    mockAddListener.mockClear();
    mockRemove.mockClear();
  });

  it("should register a listener for the onLiveActivityEnded event and forward the body to the callback", () => {
    const callback = jest.fn();

    onLiveActivityEnded(callback);

    expect(mockAddListener).toHaveBeenCalledWith("onLiveActivityEnded", expect.any(Function));

    const nativeCallback = mockAddListener.mock.calls[mockAddListener.mock.calls.length - 1][1];
    const body = { eventId: "event-1", pushToken: "token-1" };
    nativeCallback(body);

    expect(callback).toHaveBeenCalledWith(body);
  });

  it("should remove the existing subscription before registering a new one", () => {
    const firstSubscription = onLiveActivityEnded(jest.fn());
    const removeSpy = jest.spyOn(firstSubscription, "remove");

    onLiveActivityEnded(jest.fn());

    expect(removeSpy).toHaveBeenCalled();
  });
});

describe("getLiveActivityState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return AVAILABLE_WITH_SCHEDULING when platform version supports 26.0.0", () => {
    DeviceInfo.getSystemVersion.mockReturnValue("26.1.0");

    expect(getLiveActivityState()).toEqual(LiveActivityState.AvailableWithScheduling);
  });

  it("should return AVAILABLE when platform version supports 16.1.0 but not 26.0.0", () => {
    DeviceInfo.getSystemVersion.mockReturnValue("18.0.0");

    expect(getLiveActivityState()).toEqual(LiveActivityState.Available);
  });

  it("should return UNAVAILABLE when platform version supports neither 26.0.0 nor 16.1.0", () => {
    DeviceInfo.getSystemVersion.mockReturnValue("15.0.0");

    expect(getLiveActivityState()).toEqual(LiveActivityState.Unavailable);
  });
});
