import { renderHook, act } from "@testing-library/react";
import useFloatingContainerFeature from "./useFloatingContainerFeature";

let mountedCallback;
let unmountedCallback;
jest.mock("../../event-broker/event-subscriber", () =>
  jest.fn((event, callback) => {
    if (event === "@@UI/SPORTSBOOK_CHATBOT_MOUNTED") {
      mountedCallback = callback;
    }

    if (event === "@@UI/SPORTSBOOK_CHATBOT_UNMOUNTED") {
      unmountedCallback = callback;
    }
  }),
);

describe("useFloatingContainerFeature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mountedCallback = undefined;
    unmountedCallback = undefined;
  });

  it("should return null initially", () => {
    const { result } = renderHook(() => useFloatingContainerFeature());

    expect(result.current).toBeNull();
  });

  it("should return CBB feature and urn when the chatbot is mounted and available", () => {
    const { result } = renderHook(() => useFloatingContainerFeature());

    expect(mountedCallback).toBeDefined();
    act(() => mountedCallback({ urn: "test-urn", isAvailable: true }));

    expect(result.current).toEqual({ feature: "CBB", urn: "test-urn" });
  });

  it("should return null when the chatbot is mounted but not available", () => {
    const { result } = renderHook(() => useFloatingContainerFeature());

    expect(mountedCallback).toBeDefined();
    act(() => mountedCallback({ urn: "test-urn", isAvailable: false }));

    expect(result.current).toBeNull();
  });

  it("should return null when the chatbot is unmounted", () => {
    const { result } = renderHook(() => useFloatingContainerFeature());

    expect(mountedCallback).toBeDefined();
    expect(unmountedCallback).toBeDefined();

    act(() => mountedCallback({ urn: "test-urn", isAvailable: true }));
    act(() => unmountedCallback());

    expect(result.current).toBeNull();
  });

  it("should subscribe to mounted and unmounted events only once even after re-renders", () => {
    const subscribeEvent = require("../../event-broker/event-subscriber");

    const { rerender } = renderHook(() => useFloatingContainerFeature());
    rerender();
    rerender();

    expect(subscribeEvent).toHaveBeenCalledTimes(2);
    expect(subscribeEvent).toHaveBeenNthCalledWith(1, "@@UI/SPORTSBOOK_CHATBOT_MOUNTED", expect.any(Function));
    expect(subscribeEvent).toHaveBeenNthCalledWith(2, "@@UI/SPORTSBOOK_CHATBOT_UNMOUNTED", expect.any(Function));
  });
});
