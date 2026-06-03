import { renderHook } from "@testing-library/react-native";
import { useNavigationState } from "@react-navigation/native";
import { useBottomBarState } from "./useBottomBarState.native";

let NAVIGATION_STATE;

jest.mock("@react-navigation/native", () => ({
  useNavigationState: jest.fn(),
}));

describe("useBottomBarState", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    NAVIGATION_STATE = {};

    useNavigationState.mockImplementation((callback) => callback(NAVIGATION_STATE));
  });

  it("should be defined", () => {
    expect(useBottomBarState).toBeDefined();
  });

  describe("when state is empty", () => {
    it("should return isLoading as true", () => {
      const { result } = renderHook(() => useBottomBarState());

      expect(result.current).toEqual(expect.objectContaining({ isLoading: true }));
    });
  });

  describe("when state has no routes", () => {
    it("should return isLoading as true", () => {
      NAVIGATION_STATE = { routes: [] };

      const { result } = renderHook(() => useBottomBarState());

      expect(result.current).toEqual(expect.objectContaining({ isLoading: true }));
    });
  });

  describe("when state has routes", () => {
    it("should return isLoading as false", () => {
      NAVIGATION_STATE = {
        routes: [{ state: { index: 1, routes: [{ state: { index: 0 } }] } }],
      };

      const { result } = renderHook(() => useBottomBarState());

      expect(result.current).toEqual(expect.objectContaining({ isLoading: false }));
    });
  });

  describe("when is on root route", () => {
    it("should return isRootFocused as true", () => {
      NAVIGATION_STATE = {
        routes: [{ state: { index: 1, routes: [{ name: "home" }, { state: { index: 0 } }] } }],
      };

      const { result } = renderHook(() => useBottomBarState());

      expect(result.current).toEqual(expect.objectContaining({ isRootFocused: true }));
    });
  });

  describe("when is not on root route", () => {
    it("should return isRootFocused as false", () => {
      NAVIGATION_STATE = {
        routes: [{ state: { index: 0, routes: [{ state: { index: 1 } }] } }],
      };

      const { result } = renderHook(() => useBottomBarState());

      expect(result.current).toEqual(expect.objectContaining({ isRootFocused: false }));
    });
  });
});
