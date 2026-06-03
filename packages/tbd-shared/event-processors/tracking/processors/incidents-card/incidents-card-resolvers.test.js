import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getIncidentsCard } from "./IncidentsCard.graphql";
import { incidentsCardShowMoreClickTrackingResolver } from "./incidents-card-resolvers";

jest.mock("./IncidentsCard.graphql", () => ({
  getIncidentsCard: jest.fn(),
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
  fixture: {
    urn: "fixtureUrn",
    sportevent: {
      urn: "eventUrn",
      name: "event name",
      competition: {
        urn: "competitionUrn",
        name: "competition name",
      },
    },
  },
};

describe("IncidentsCard tracking resolvers", () => {
  describe("IncidentsCardShowMoreClickTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);
    describe("when we're not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getIncidentsCard.mockResolvedValueOnce(null);

        await incidentsCardShowMoreClickTrackingResolver(
          {
            urn: "urn",
            showMore: false,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the fixture comes as null", () => {
      it("should not call the 'sendEvent' function", async () => {
        getIncidentsCard.mockResolvedValueOnce({
          urn: "urn",
          fixture: null,
        });

        await incidentsCardShowMoreClickTrackingResolver(
          {
            urn: "urn",
            showMore: false,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card data", () => {
      it("should call the 'sendEvent' function with the correct event when showMore is false", async () => {
        getIncidentsCard.mockResolvedValueOnce(cardMock);
        createViewTypeSelector.mockReturnValue(() => "EVENT");

        await incidentsCardShowMoreClickTrackingResolver(
          {
            urn: "urn",
            showMore: false,
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "closed",
          element_text: "show less",
          event: "interface",
          module: "event - scoreboard - null - competition name - event name - in-play",
          event_context: "null",
          game_filter: "null",
          swimlane_type: "null",
        });
      });
      it("should call the 'sendEvent' function with the correct event when showMore is true", async () => {
        getIncidentsCard.mockResolvedValueOnce(cardMock);
        createViewTypeSelector.mockReturnValue(() => "EVENT");

        await incidentsCardShowMoreClickTrackingResolver(
          {
            urn: "urn",
            showMore: true,
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "opened",
          element_text: "show more",
          event: "interface",
          module: "event - scoreboard - null - competition name - event name - in-play",
          event_context: "null",
          game_filter: "null",
          swimlane_type: "null",
        });
      });
    });
  });
});
