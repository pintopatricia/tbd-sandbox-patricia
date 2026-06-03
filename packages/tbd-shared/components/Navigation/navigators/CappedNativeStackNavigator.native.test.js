import { StackActions } from "@react-navigation/native";
import React from "react";
import { render } from "@testing-library/react-native";
import {
  createCappedStackRouter,
  getTrimmedRoutes,
  CappedNativeStackNavigator,
} from "./CappedNativeStackNavigator.native";

jest.mock("@react-navigation/native-stack", () => ({
  NativeStackView: jest.fn(() => null),
}));

const mockGetStateForAction = jest.fn();
const mockUseNavigationBuilder = jest.fn();

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  StackRouter: jest.fn(() => ({
    getStateForAction: mockGetStateForAction,
  })),
  useNavigationBuilder: (...args) => mockUseNavigationBuilder(...args),
}));

function makeRoute(name, viewUrn, key) {
  return {
    key: key || `${name}-${Math.random().toString(36).slice(2)}`,
    name,
    params: viewUrn ? { viewLink: { viewUrn } } : undefined,
  };
}

function makeState(routes) {
  return {
    stale: false,
    type: "stack",
    key: "stack-1",
    index: routes.length - 1,
    routeNames: [...new Set(routes.map((r) => r.name))],
    routes,
  };
}

describe("getTrimmedRoutes", () => {
  it("returns null when no trimming is needed", () => {
    const routes = [makeRoute("Home", undefined, "home-1"), makeRoute("Race", "urn:race:1", "race-1")];

    expect(getTrimmedRoutes(routes, 3)).toBeNull();
  });

  it("deduplicates routes with the same name and viewUrn, keeping the newest", () => {
    const routes = [
      makeRoute("Race", "urn:race:1", "race-1"),
      makeRoute("Home", undefined, "home-1"),
      makeRoute("Race", "urn:race:1", "race-2"),
    ];

    const result = getTrimmedRoutes(routes, 3);

    expect(result).toHaveLength(2);
    expect(result[0].key).toBe("home-1");
    expect(result[1].key).toBe("race-2");
  });

  it("caps same-name routes at maxSameType, keeping the newest N", () => {
    const routes = [
      makeRoute("Race", "urn:race:1", "race-1"),
      makeRoute("Race", "urn:race:2", "race-2"),
      makeRoute("Race", "urn:race:3", "race-3"),
      makeRoute("Race", "urn:race:4", "race-4"),
    ];

    const result = getTrimmedRoutes(routes, 3);

    expect(result).toHaveLength(3);
    expect(result[0].key).toBe("race-2");
    expect(result[1].key).toBe("race-3");
    expect(result[2].key).toBe("race-4");
  });

  it("caps at maxSameType=1", () => {
    const routes = [makeRoute("Race", "urn:race:1", "race-1"), makeRoute("Race", "urn:race:2", "race-2")];

    const result = getTrimmedRoutes(routes, 1);

    expect(result).toHaveLength(1);
    expect(result[0].key).toBe("race-2");
  });

  it("handles mixed screen types correctly", () => {
    const routes = [
      makeRoute("Home", undefined, "home-1"),
      makeRoute("Race", "urn:race:1", "race-1"),
      makeRoute("Race", "urn:race:2", "race-2"),
      makeRoute("Race", "urn:race:3", "race-3"),
      makeRoute("Race", "urn:race:4", "race-4"),
    ];

    const result = getTrimmedRoutes(routes, 3);

    expect(result).toHaveLength(4);
    expect(result[0].key).toBe("home-1");
    expect(result[1].key).toBe("race-2");
    expect(result[2].key).toBe("race-3");
    expect(result[3].key).toBe("race-4");
  });

  it("deduplicates AND caps in one pass", () => {
    const routes = [
      makeRoute("Race", "urn:race:1", "race-1"),
      makeRoute("Race", "urn:race:2", "race-2"),
      makeRoute("Race", "urn:race:1", "race-3"),
      makeRoute("Race", "urn:race:3", "race-4"),
      makeRoute("Race", "urn:race:4", "race-5"),
    ];

    const result = getTrimmedRoutes(routes, 3);

    expect(result).toHaveLength(3);
    expect(result[0].key).toBe("race-3");
    expect(result[1].key).toBe("race-4");
    expect(result[2].key).toBe("race-5");
  });

  it("treats routes without viewUrn as unique by key (no dedup)", () => {
    const routes = [
      makeRoute("Settings", undefined, "settings-1"),
      makeRoute("Settings", undefined, "settings-2"),
      makeRoute("Settings", undefined, "settings-3"),
      makeRoute("Settings", undefined, "settings-4"),
    ];

    const result = getTrimmedRoutes(routes, 3);

    expect(result).toHaveLength(3);
    expect(result[0].key).toBe("settings-2");
    expect(result[1].key).toBe("settings-3");
    expect(result[2].key).toBe("settings-4");
  });

  it("preserves order of different screen types", () => {
    const routes = [
      makeRoute("Home", undefined, "home-1"),
      makeRoute("Race", "urn:race:1", "race-1"),
      makeRoute("Competition", "urn:comp:1", "comp-1"),
      makeRoute("Race", "urn:race:2", "race-2"),
    ];

    expect(getTrimmedRoutes(routes, 3)).toBeNull();
  });

  it("does not conflate different name+viewUrn pairs that share the same naive concatenation", () => {
    // With "name:viewUrn" concatenation, ("Race:", "urn") and ("Race", ":urn") would
    // produce the same string "Race::urn". JSON.stringify encodes them as distinct arrays.
    const routes = [
      makeRoute("Race:", "urn", "race-1"),
      makeRoute("Race:", "urn", "race-2"), // true duplicate — should be deduped
      makeRoute("Race", ":urn", "race-3"), // different identity — must be kept
    ];

    const result = getTrimmedRoutes(routes, 3);

    // race-1 is deduped (same identity as race-2), race-2 and race-3 are kept
    expect(result).toHaveLength(2);
    expect(result[0].key).toBe("race-2");
    expect(result[1].key).toBe("race-3");
  });
});

describe("CappedStackRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createRouter(maxSameType = 3) {
    const factory = createCappedStackRouter(maxSameType);
    return factory({ routeNames: ["Home", "Race", "Competition"], routeParamList: {}, routeGetIdList: {} });
  }

  describe("NAVIGATE → PUSH conversion", () => {
    it("converts NAVIGATE to PUSH when screen name already exists in stack", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1"), makeRoute("Race", "urn:race:1", "race-1")]);
      const pushedState = makeState([...state.routes, makeRoute("Race", "urn:race:2", "race-new")]);

      mockGetStateForAction.mockReturnValue(pushedState);

      const router = createRouter();
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:2" } } } };

      router.getStateForAction(state, action, {});

      expect(mockGetStateForAction).toHaveBeenCalledWith(
        state,
        StackActions.push("Race", { viewLink: { viewUrn: "urn:race:2" } }),
        {},
      );
    });

    it("does not convert NAVIGATE to PUSH when screen name is new to the stack", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1")]);

      mockGetStateForAction.mockReturnValue(state);

      const router = createRouter();
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:1" } } } };

      router.getStateForAction(state, action, {});

      expect(mockGetStateForAction).toHaveBeenCalledWith(state, action, {});
    });

    it("passes through when navigating to same screen name + same viewUrn as top", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1"), makeRoute("Race", "urn:race:1", "race-1")]);

      mockGetStateForAction.mockReturnValue(state);

      const router = createRouter();
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:1" } } } };

      router.getStateForAction(state, action, {});

      expect(mockGetStateForAction).toHaveBeenCalledWith(state, action, {});
    });
  });

  describe("inline trimming after PUSH", () => {
    it("trims the stack to maxSameType after PUSH exceeds cap", () => {
      const state = makeState([
        makeRoute("Home", undefined, "home-1"),
        makeRoute("Race", "urn:race:1", "race-1"),
        makeRoute("Race", "urn:race:2", "race-2"),
        makeRoute("Race", "urn:race:3", "race-3"),
      ]);
      const pushedState = makeState([...state.routes, makeRoute("Race", "urn:race:4", "race-4")]);

      mockGetStateForAction.mockReturnValue(pushedState);

      const router = createRouter(3);
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:4" } } } };

      const result = router.getStateForAction(state, action, {});

      const raceRoutes = result.routes.filter((r) => r.name === "Race");
      expect(raceRoutes).toHaveLength(3);
      expect(raceRoutes[0].params.viewLink.viewUrn).toBe("urn:race:2");
      expect(raceRoutes[1].params.viewLink.viewUrn).toBe("urn:race:3");
      expect(raceRoutes[2].params.viewLink.viewUrn).toBe("urn:race:4");
    });

    it("deduplicates when navigating to same viewUrn buried in stack", () => {
      const state = makeState([
        makeRoute("Home", undefined, "home-1"),
        makeRoute("Race", "urn:race:1", "race-1"),
        makeRoute("Race", "urn:race:2", "race-2"),
      ]);
      const pushedState = makeState([...state.routes, makeRoute("Race", "urn:race:1", "race-new")]);

      mockGetStateForAction.mockReturnValue(pushedState);

      const router = createRouter(3);
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:1" } } } };

      const result = router.getStateForAction(state, action, {});

      const raceRoutes = result.routes.filter((r) => r.name === "Race");
      expect(raceRoutes).toHaveLength(2);
      expect(raceRoutes[1].params.viewLink.viewUrn).toBe("urn:race:1");
      expect(raceRoutes[1].key).toBe("race-new");
    });

    it("does not trim when cap is not exceeded", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1"), makeRoute("Race", "urn:race:1", "race-1")]);
      const pushedState = makeState([...state.routes, makeRoute("Race", "urn:race:2", "race-2")]);

      mockGetStateForAction.mockReturnValue(pushedState);

      const router = createRouter(3);
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:2" } } } };

      const result = router.getStateForAction(state, action, {});

      expect(result.routes).toHaveLength(3);
    });

    it("respects custom maxSameType value", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1"), makeRoute("Race", "urn:race:1", "race-1")]);
      const pushedState = makeState([...state.routes, makeRoute("Race", "urn:race:2", "race-2")]);

      mockGetStateForAction.mockReturnValue(pushedState);

      const router = createRouter(1);
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:2" } } } };

      const result = router.getStateForAction(state, action, {});

      const raceRoutes = result.routes.filter((r) => r.name === "Race");
      expect(raceRoutes).toHaveLength(1);
      expect(raceRoutes[0].params.viewLink.viewUrn).toBe("urn:race:2");
    });

    it("preserves non-capped routes when trimming", () => {
      const state = makeState([
        makeRoute("Home", undefined, "home-1"),
        makeRoute("Competition", "urn:comp:1", "comp-1"),
        makeRoute("Race", "urn:race:1", "race-1"),
        makeRoute("Race", "urn:race:2", "race-2"),
      ]);
      const pushedState = makeState([...state.routes, makeRoute("Race", "urn:race:3", "race-3")]);

      mockGetStateForAction.mockReturnValue(pushedState);

      const router = createRouter(2);
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:3" } } } };

      const result = router.getStateForAction(state, action, {});

      expect(result.routes.find((r) => r.key === "home-1")).toBeDefined();
      expect(result.routes.find((r) => r.key === "comp-1")).toBeDefined();
      const raceRoutes = result.routes.filter((r) => r.name === "Race");
      expect(raceRoutes).toHaveLength(2);
      expect(raceRoutes[0].params.viewLink.viewUrn).toBe("urn:race:2");
      expect(raceRoutes[1].params.viewLink.viewUrn).toBe("urn:race:3");
    });

    it("sets index to last route after trimming", () => {
      const state = makeState([
        makeRoute("Home", undefined, "home-1"),
        makeRoute("Race", "urn:race:1", "race-1"),
        makeRoute("Race", "urn:race:2", "race-2"),
      ]);
      const pushedState = makeState([...state.routes, makeRoute("Race", "urn:race:3", "race-3")]);

      mockGetStateForAction.mockReturnValue(pushedState);

      const router = createRouter(2);
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:3" } } } };

      const result = router.getStateForAction(state, action, {});

      expect(result.index).toBe(result.routes.length - 1);
      expect(result.routes[result.index].params.viewLink.viewUrn).toBe("urn:race:3");
    });
  });

  describe("passthrough behavior", () => {
    it("passes non-NAVIGATE actions through to the base router", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1"), makeRoute("Race", "urn:race:1", "race-1")]);
      const poppedState = makeState([makeRoute("Home", undefined, "home-1")]);

      mockGetStateForAction.mockReturnValue(poppedState);

      const router = createRouter();

      const result = router.getStateForAction(state, { type: "POP" }, {});

      expect(result).toEqual(poppedState);
      expect(mockGetStateForAction).toHaveBeenCalledWith(state, { type: "POP" }, {});
    });

    it("passes NAVIGATE without viewUrn through to the base router", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1")]);
      const navigatedState = makeState([...state.routes, makeRoute("Race", undefined, "race-1")]);

      mockGetStateForAction.mockReturnValue(navigatedState);

      const router = createRouter();
      const action = { type: "NAVIGATE", payload: { name: "Race", params: {} } };

      const result = router.getStateForAction(state, action, {});

      expect(result).toEqual(navigatedState);
      expect(mockGetStateForAction).toHaveBeenCalledWith(state, action, {});
    });

    it("passes NAVIGATE without payload through to the base router", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1")]);

      mockGetStateForAction.mockReturnValue(null);

      const router = createRouter();
      const action = { type: "NAVIGATE" };

      const result = router.getStateForAction(state, action, {});

      expect(result).toBeNull();
      expect(mockGetStateForAction).toHaveBeenCalledWith(state, action, {});
    });
  });

  describe("maxSameType clamping", () => {
    it("clamps maxSameType of 0 to 1", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1"), makeRoute("Race", "urn:race:1", "race-1")]);
      const pushedState = makeState([...state.routes, makeRoute("Race", "urn:race:2", "race-2")]);

      mockGetStateForAction.mockReturnValue(pushedState);

      const router = createRouter(0);
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:2" } } } };

      const result = router.getStateForAction(state, action, {});

      const raceRoutes = result.routes.filter((r) => r.name === "Race");
      expect(raceRoutes).toHaveLength(1);
      expect(raceRoutes[0].params.viewLink.viewUrn).toBe("urn:race:2");
    });

    it("clamps negative maxSameType to 1", () => {
      const state = makeState([makeRoute("Home", undefined, "home-1"), makeRoute("Race", "urn:race:1", "race-1")]);
      const pushedState = makeState([...state.routes, makeRoute("Race", "urn:race:2", "race-2")]);

      mockGetStateForAction.mockReturnValue(pushedState);

      const router = createRouter(-5);
      const action = { type: "NAVIGATE", payload: { name: "Race", params: { viewLink: { viewUrn: "urn:race:2" } } } };

      const result = router.getStateForAction(state, action, {});

      const raceRoutes = result.routes.filter((r) => r.name === "Race");
      expect(raceRoutes).toHaveLength(1);
      expect(result.index).toBe(result.routes.length - 1);
    });
  });
});

describe("CappedNativeStackNavigator tabPress behavior", () => {
  const mockAddListener = jest.fn();
  const mockDispatch = jest.fn();
  const mockIsFocused = jest.fn();
  const mockGetState = jest.fn();

  function setupNavigationMock({ index }) {
    const routes = [makeRoute("Home", undefined, "home-1"), makeRoute("Race", "urn:race:1", "race-1")];
    const state = { ...makeState(routes), index, key: "stack-test-key" };

    mockGetState.mockReturnValue(state);

    mockUseNavigationBuilder.mockReturnValue({
      state,
      navigation: {
        addListener: mockAddListener,
        dispatch: mockDispatch,
        isFocused: mockIsFocused,
        getState: mockGetState,
      },
      descriptors: {},
      describe: jest.fn(),
      NavigationContent: ({ children }) => children,
    });
  }

  beforeAll(() => {
    global.requestAnimationFrame = jest.fn((cb) => cb());
  });

  afterAll(() => {
    delete global.requestAnimationFrame;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function fireTabPress(defaultPrevented = false) {
    const [, callback] = mockAddListener.mock.calls.find(([event]) => event === "tabPress");
    callback({ defaultPrevented });
  }

  it("dispatches popToTop with target when tabPress fires and index > 0 and focused", () => {
    setupNavigationMock({ index: 1 });
    mockIsFocused.mockReturnValue(true);

    render(React.createElement(CappedNativeStackNavigator, {}));

    fireTabPress();

    expect(mockDispatch).toHaveBeenCalledWith({
      ...StackActions.popToTop(),
      target: "stack-test-key",
    });
  });

  it("does not dispatch when defaultPrevented is true", () => {
    setupNavigationMock({ index: 1 });
    mockIsFocused.mockReturnValue(true);

    render(React.createElement(CappedNativeStackNavigator, {}));

    fireTabPress(true);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch when index is 0", () => {
    setupNavigationMock({ index: 0 });
    mockIsFocused.mockReturnValue(true);

    render(React.createElement(CappedNativeStackNavigator, {}));

    fireTabPress();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch when navigator is not focused", () => {
    setupNavigationMock({ index: 1 });
    mockIsFocused.mockReturnValue(false);

    render(React.createElement(CappedNativeStackNavigator, {}));

    fireTabPress();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("uses state from getState() at RAF time, not the state captured at listener registration", () => {
    setupNavigationMock({ index: 1 });
    mockIsFocused.mockReturnValue(true);

    render(React.createElement(CappedNativeStackNavigator, {}));

    // State changes before RAF fires: stack popped back to root
    mockGetState.mockReturnValue({ index: 0, key: "stack-test-key" });

    fireTabPress();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch when getState returns undefined", () => {
    setupNavigationMock({ index: 1 });
    mockIsFocused.mockReturnValue(true);
    mockGetState.mockReturnValue(undefined);

    render(React.createElement(CappedNativeStackNavigator, {}));

    fireTabPress();

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
