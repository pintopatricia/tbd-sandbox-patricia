import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getStatsContentCardGroup } from "./StatsContentCardGroup.graphql";
import { statsContentCardGroupTabClickTrackingResolver } from "./stats-content-card-group-resolvers";

jest.mock("./StatsContentCardGroup.graphql", () => ({
  getStatsContentCardGroup: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn().mockReturnValue({
    tabName: "Bananas",
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
    urn: "eventUrn",
    name: "event name",
    competition: {
      urn: "competitionUrn",
      name: "competition name",
    },
  },
};

describe("StatsContentCardGroup tracking resolvers", () => {
  describe("statsContentCardGroupTabClickTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getStatsContentCardGroup.mockResolvedValueOnce(null);

        await statsContentCardGroupTabClickTrackingResolver(
          {
            urn: "urn",
            isOpen: false,
            itemUrn: "itemUrn",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call the 'sendEvent' function", async () => {
        await statsContentCardGroupTabClickTrackingResolver(
          {
            isOpen: false,
            itemUrn: "itemUrn",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no item urn", () => {
      it("should not call the 'sendEvent' function", async () => {
        await statsContentCardGroupTabClickTrackingResolver(
          {
            urn: "urn",
            isOpen: false,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card data", () => {
      it("should call the 'sendEvent' function", async () => {
        getStatsContentCardGroup.mockResolvedValueOnce(cardMock);
        createViewTypeSelector.mockReturnValue(() => "EVENT");

        await statsContentCardGroupTabClickTrackingResolver(
          {
            urn: "urn",
            isOpen: false,
            itemUrn: "itemUrn",
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "closed",
          element_text: "stats - bananas",
          event: "interface",
          module: "event - null - null - competition name - event name - status",
          event_context: "null",
          game_filter: "null",
          swimlane_type: "null",
        });
      });
    });
  });
});
