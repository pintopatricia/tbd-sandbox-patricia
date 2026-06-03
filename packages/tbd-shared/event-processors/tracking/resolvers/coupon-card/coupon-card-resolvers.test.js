import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getStatsPebbleCardGroup } from "../../processors/stats-pebble-card-group/StatsPebbleCardGroup.graphql";
import { couponStatsButtonClickTrackingResolver } from "./coupon-card-resolvers";

jest.mock("../../processors/stats-pebble-card-group/StatsPebbleCardGroup.graphql", () => ({
  getStatsPebbleCardGroup: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn().mockReturnValue({
    cardGroupTitle: "card name",
    marketTitle: "market name",
  }),
}));

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(),
}));

const sendEvent = jest.fn();
const cardMock = {
  urn: "urn",
  status: "status",
  sportEvent: {
    urn: "urn",
    name: "event name",
    competition: {
      urn: "urn",
      name: "competition name",
    },
  },
};

describe("CouponCard Tracking resolvers", () => {
  describe("couponStatsButtonClickTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card", () => {
      it("should not call 'sendEvent' function", () => {
        getStatsPebbleCardGroup.mockResolvedValueOnce(null);

        couponStatsButtonClickTrackingResolver({ statsPebbleUrn: "urn", isOpen: false }, sendEvent);
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no statsPebbleUrn", () => {
      it("should not call 'sendEvent'", () => {
        couponStatsButtonClickTrackingResolver({ isOpen: false }, sendEvent);
        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card", () => {
      it("should call 'sendEvent function", async () => {
        getStatsPebbleCardGroup.mockResolvedValueOnce(cardMock);
        createViewTypeSelector.mockReturnValue(() => "HOME");

        await couponStatsButtonClickTrackingResolver(
          {
            statsPebbleUrn: "urn",
            isOpen: true,
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "opened",
          element_text: "stats",
          event: "interface",
          module: "home - card name - market name - competition name - event name - status",
          event_context: "null",
          game_filter: "null",
          swimlane_type: "null",
        });
      });
    });
  });
});
