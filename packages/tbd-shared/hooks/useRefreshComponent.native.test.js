import { act, renderHook } from "@testing-library/react-native";
import { AppState as MockedAppState } from "react-native";
import { resetRefreshTimestamps, URNStaleCheckTimestamps } from "./useRefreshComponent.common";
import { useRefreshComponent } from "./useRefreshComponent.native";

jest.mock("../event-processors/live-data/resolvers/coupon-card-resolvers", () => ({
  refreshCouponCard: jest.fn(),
}));

jest.mock("react-native", () => {
  const listeners = new Set();

  const mockedAppState = {
    currentState: "active",
    addEventListener: jest.fn((_type, handler) => {
      listeners.add(handler);
      return {
        remove: () => listeners.delete(handler),
      };
    }),
    emitChange(state) {
      this.currentState = state;
      listeners.forEach((listener) => listener(state));
    },
    resetListeners() {
      listeners.clear();
    },
  };

  return { AppState: mockedAppState };
});

const emitAppStateChange = (state) => {
  MockedAppState.emitChange(state);
};

describe("useRefreshComponent (native)", () => {
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
    resetRefreshTimestamps();
    MockedAppState.resetListeners();
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

  it("should call refreshAction when URN is stale on mount", () => {
    URNStaleCheckTimestamps.set(defaultUseRefreshComponentProps.urn, STALE_TIMESTAMP);

    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    expect(mockRefreshAction).toHaveBeenCalledWith({ urn: defaultUseRefreshComponentProps.urn });
  });

  it("should not call refreshAction when URN is fresh on mount", () => {
    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    expect(mockRefreshAction).not.toHaveBeenCalled();
  });

  it("triggers refresh when returning to active state after timeout", () => {
    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    URNStaleCheckTimestamps.set(defaultUseRefreshComponentProps.urn, STALE_TIMESTAMP);

    act(() => {
      emitAppStateChange("background");
      emitAppStateChange("active");
    });

    expect(mockRefreshAction).toHaveBeenCalledTimes(1);
    expect(mockRefreshAction).toHaveBeenCalledWith({ urn: defaultUseRefreshComponentProps.urn });
  });

  it("should not trigger refresh when app state changes but URN is not stale", () => {
    renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    act(() => {
      emitAppStateChange("background");
      emitAppStateChange("active");
    });

    expect(mockRefreshAction).not.toHaveBeenCalled();
  });

  it("should trigger refresh when returning from inactive state", () => {
    renderHook(() => useRefreshComponent({ ...defaultUseRefreshComponentProps }));

    URNStaleCheckTimestamps.set(defaultUseRefreshComponentProps.urn, STALE_TIMESTAMP);

    act(() => {
      emitAppStateChange("inactive");
      emitAppStateChange("active");
    });

    expect(mockRefreshAction).toHaveBeenCalledTimes(1);
    expect(mockRefreshAction).toHaveBeenCalledWith({ urn: defaultUseRefreshComponentProps.urn });
  });

  it("should clean up AppState listener on unmount", () => {
    const mockSubscription = { remove: jest.fn() };
    const addEventListenerSpy = jest.spyOn(MockedAppState, "addEventListener");
    addEventListenerSpy.mockReturnValue(mockSubscription);

    const { unmount } = renderHook(() => useRefreshComponent(defaultUseRefreshComponentProps));

    unmount();

    expect(mockSubscription.remove).toHaveBeenCalled();
  });
});
