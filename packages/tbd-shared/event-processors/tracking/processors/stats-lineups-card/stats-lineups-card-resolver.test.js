import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getStatsLineupsCard } from "./StatsLineupsCard.graphql";
import { statsLineupsOnChangeViewTrackingResolver } from "./stats-lineups-card-resolver";

jest.mock("./StatsLineupsCard.graphql", () => ({
  getStatsLineupsCard: jest.fn(),
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
    urn: "urn",
    name: "event name",
    competition: {
      urn: "urn",
      name: "competition name",
    },
  },
};

describe("StatsLineupsCard Tracking resolvers", () => {
  describe("statsLineupsOnChangeViewTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card", () => {
      it("should not call 'sendEvent' function", async () => {
        getStatsLineupsCard.mockResolvedValueOnce(null);

        await statsLineupsOnChangeViewTrackingResolver(
          {
            cardUrn: "urn",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no cardUrn", () => {
      it("should not call 'sendEvent'", async () => {
        await statsLineupsOnChangeViewTrackingResolver({}, sendEvent);

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card", () => {
      it("should call 'sendEvent function", async () => {
        getStatsLineupsCard.mockResolvedValueOnce(cardMock);
        createViewTypeSelector.mockReturnValueOnce(() => "event");

        await statsLineupsOnChangeViewTrackingResolver(
          {
            cardUrn: "urn",
            view: "formation-view",
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "clicked",
          element_text: "stats - lineups - view switcher - formation view",
          event: "interface",
          module: "event - lineups - null - competition name - event name - status",
          event_context: "null",
          game_filter: "null",
          swimlane_type: "null",
        });
      });
    });
  });
});
