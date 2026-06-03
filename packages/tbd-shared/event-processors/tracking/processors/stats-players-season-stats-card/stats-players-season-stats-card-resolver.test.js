import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getStatsPlayersSeasonStats } from "./StatsPlayersSeasonStatsCard.graphql";
import { statsPlayersSeasonStatsExpandableButtonTrackingResolver } from "./stats-players-season-stats-card-resolver";

jest.mock("./StatsPlayersSeasonStatsCard.graphql", () => ({
  getStatsPlayersSeasonStats: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
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

describe("StatsPlayersSeasonStatsCard tracking resolvers", () => {
  describe("statsPlayersSeasonStatsExpandableButtonTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getStatsPlayersSeasonStats.mockResolvedValueOnce(null);

        await statsPlayersSeasonStatsExpandableButtonTrackingResolver(
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
        await statsPlayersSeasonStatsExpandableButtonTrackingResolver(
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
        await statsPlayersSeasonStatsExpandableButtonTrackingResolver(
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
      describe("when the card action is closed", () => {
        it("should call the 'sendEvent' function with action closed", async () => {
          getStatsPlayersSeasonStats.mockResolvedValueOnce(cardMock);
          createViewTypeSelector.mockReturnValue(() => "EVENT");

          await statsPlayersSeasonStatsExpandableButtonTrackingResolver(
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
            element_text: "stats - show less",
            event: "interface",
            module: "event - null - null - competition name - event name - pre-match",
            event_context: "null",
            game_filter: "null",
            swimlane_type: "null",
          });
        });
      });

      describe("when the card action is opened", () => {
        it("should call the 'sendEvent' function with action opened", async () => {
          getStatsPlayersSeasonStats.mockResolvedValueOnce(cardMock);
          createViewTypeSelector.mockReturnValue(() => "EVENT");

          await statsPlayersSeasonStatsExpandableButtonTrackingResolver(
            {
              urn: "urn",
              isOpen: true,
              itemUrn: "itemUrn",
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            action: "opened",
            element_text: "stats - show more",
            event: "interface",
            module: "event - null - null - competition name - event name - pre-match",
            event_context: "null",
            game_filter: "null",
            swimlane_type: "null",
          });
        });
      });
    });
  });
});
