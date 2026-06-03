import { render, act } from "@testing-library/react-native";

import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { TrackingBar } from "@ppb/the-wall-native";

import EnhancedTracking from "./EnhancedTracking.native";

jest.mock("@ppb/the-wall-native", () => ({
  TrackingBar: jest.fn(() => <tracking-bar-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useVisibilityStatus: jest.fn(() => true),
}));

const renderEnhancedTracking = (props) => render(<EnhancedTracking {...props} />);

const BASE_PROPS = {
  dispatchSubscribeFixtureUpdates: jest.fn(),
  dispatchUnsubscribeFixtureUpdates: jest.fn(),
};

const PROPS = {
  ...BASE_PROPS,
  urn: "urn",
  typename: "typename",
  enhancedTrackingData: [
    {
      currentValue: 0,
      goal: 5,
      status: "PENDING",
    },
    {
      currentValue: 3,
      goal: 2,
      status: "ACTIVE",
    },
  ],
  subscribeTeamStats: true,
  footballPlayerIds: ["1234"],
  includeSubstitutions: false,
};

describe("EnhancedTracking", () => {
  beforeEach(jest.clearAllMocks);

  describe("when urn and typename are undefined", () => {
    it("should not call dispatchSubscribeFixtureUpdates on mount", () => {
      renderEnhancedTracking(BASE_PROPS);

      expect(BASE_PROPS.dispatchSubscribeFixtureUpdates).not.toHaveBeenCalled();
    });

    it("should not call dispatchUnsubscribeFixtureUpdates on unmount", () => {
      const { unmount } = renderEnhancedTracking(BASE_PROPS);
      unmount();

      expect(BASE_PROPS.dispatchUnsubscribeFixtureUpdates).not.toHaveBeenCalled();
    });

    it("should not render the TrackingBar component", () => {
      renderEnhancedTracking(BASE_PROPS);

      expect(TrackingBar).not.toHaveBeenCalled();
    });
  });

  describe("when urn and typename are defined", () => {
    it("should call dispatchSubscribeFixtureUpdates on mount", () => {
      renderEnhancedTracking(PROPS);

      expect(PROPS.dispatchSubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
      expect(PROPS.dispatchSubscribeFixtureUpdates).toHaveBeenCalledWith(
        PROPS.urn,
        PROPS.typename,
        PROPS.subscribeTeamStats,
        PROPS.footballPlayerIds,
        PROPS.includeSubstitutions,
      );
    });

    it("should call dispatchUnsubscribeFixtureUpdates on unmount", () => {
      const { unmount } = renderEnhancedTracking(PROPS);

      act(() => {
        unmount();
      });

      expect(PROPS.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
      expect(PROPS.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledWith(PROPS.urn, PROPS.typename);
    });

    it("should render the TrackingBar component", () => {
      renderEnhancedTracking(PROPS);

      expect(TrackingBar).toHaveBeenCalledTimes(2);
      expect(TrackingBar).toHaveBeenNthCalledWith(
        1,
        {
          currentValue: 0,
          goalValue: 5,
          status: TrackingBarStatus.PENDING,
        },
        undefined,
      );
      expect(TrackingBar).toHaveBeenNthCalledWith(
        2,
        {
          currentValue: 3,
          goalValue: 2,
          status: TrackingBarStatus.ACTIVE,
        },
        undefined,
      );
    });
  });
});
