import { renderHook } from "@testing-library/react";
import { URNStaleCheckTimestamps } from "./useRefreshComponent.common";
import { useRefreshComponent } from "./useRefreshComponent.web";

Object.defineProperty(document, "hidden", {
  writable: true,
  value: false,
});

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(document, "addEventListener", {
  value: mockAddEventListener,
});

Object.defineProperty(document, "removeEventListener", {
  value: mockRemoveEventListener,
});

describe("useRefreshComponent", () => {
  const STALE_TIMESTAMP = Date.now() - 141000;
  let mockRefreshAction;
  const defaultUseRefreshComponentProps = {
    urn: "test-urn",
    refreshAction: mockRefreshAction,
    chefComponentName: "TestComponent",
  };

  beforeAll(() => {
    mockRefreshAction = jest.fn();
    defaultUseRefreshComponentProps.refreshAction = mockRefreshAction;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    URNStaleCheckTimestamps.clear();
    mockRefreshAction.mockClear();
  });

  it("should call refreshAction when the entry is stale", () => {
    URNStaleCheckTimestamps.set(defaultUseRefreshComponentProps.urn, STALE_TIMESTAMP);

    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    expect(mockRefreshAction).toHaveBeenCalled();
  });

  it("should not call refreshAction when refreshEnabled is false", () => {
    URNStaleCheckTimestamps.set(defaultUseRefreshComponentProps.urn, STALE_TIMESTAMP);

    renderHook(() =>
      useRefreshComponent({
        ...defaultUseRefreshComponentProps,
        refreshEnabled: false,
      }),
    );

    expect(mockRefreshAction).not.toHaveBeenCalled();
  });

  it("should add visibilitychange event listener", () => {
    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    expect(mockAddEventListener).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
  });

  it("should remove event listener on cleanup", () => {
    const { unmount } = renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
  });

  it("should trigger refresh when tab becomes visible and URN is stale", () => {
    URNStaleCheckTimestamps.set(defaultUseRefreshComponentProps.urn, STALE_TIMESTAMP);

    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    const visibilityChangeHandler = mockAddEventListener.mock.calls.find((call) => call[0] === "visibilitychange")[1];

    Object.defineProperty(document, "hidden", { value: false });
    visibilityChangeHandler();

    expect(mockRefreshAction).toHaveBeenCalledWith({ urn: defaultUseRefreshComponentProps.urn });
  });

  it("should not trigger refresh when tab becomes visible but URN is not stale", () => {
    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    Object.defineProperty(document, "hidden", { value: true });

    const visibilityChangeHandler = mockAddEventListener.mock.calls.find((call) => call[0] === "visibilitychange")[1];

    Object.defineProperty(document, "hidden", { value: false });
    visibilityChangeHandler();

    expect(mockRefreshAction).not.toHaveBeenCalled();
  });

  it("should not add event listener when refreshEnabled is false", () => {
    renderHook(() =>
      useRefreshComponent({
        ...defaultUseRefreshComponentProps,
        refreshEnabled: false,
      }),
    );

    expect(mockAddEventListener).not.toHaveBeenCalled();
  });

  it("should call refreshAction when URN is stale on mount", () => {
    URNStaleCheckTimestamps.set(defaultUseRefreshComponentProps.urn, STALE_TIMESTAMP);

    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    expect(mockRefreshAction).toHaveBeenCalledWith({ urn: defaultUseRefreshComponentProps.urn });
  });

  it("should not call refreshAction when URN is fresh on mount", () => {
    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    expect(mockRefreshAction).not.toHaveBeenCalled();
  });
});
