import { getPenaltyTakersCard } from "./PenaltyTakersCard.graphql";
import {
  penaltyTakersCardPlayerSwipeTrackingResolver,
  penaltyTakersCardSegmentChangeTrackingResolver,
  penaltyTakersCardVisibilityTrackingResolver,
} from "./penalty-takers-card-resolvers";

jest.mock("@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers", () => ({
  getSportsbookRunnerMetrics: jest.fn(),
}));

jest.mock("./PenaltyTakersCard.graphql", () => ({
  getPenaltyTakersCard: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn().mockReturnValue({
    tabName: "Penalties",
  }),
}));

const CARD_URN = "ppb:tbd:card:penaltyTakers:acO6QhQAAF2E2RnN/e/35449296";

const sendEvent = jest.fn();
const cardMock = {
  __typename: "PenaltyTakersCard",
  urn: CARD_URN,
  event: { urn: "ppb:sportevent:35449296", name: "Sporting vs Porto" },
  penaltyTakers: [
    {
      player: {
        __typename: "FootballPlayerFixtureContext",
        urn: "ppb:footballPlayerFixtureContext:1",
        player: { id: "1", name: "Harry Kane" },
      },
    },
    {
      player: {
        __typename: "FootballPlayerFixtureContext",
        urn: "ppb:footballPlayerFixtureContext:2",
        player: { id: "2", name: "Cristiano Ronaldo" },
      },
    },
    {
      player: {
        __typename: "FootballPlayerFixtureContext",
        urn: "ppb:footballPlayerFixtureContext:3",
        player: { id: "3", name: "Kylian Mbappe" },
      },
    },
  ],
};

describe("PenaltyTakersCardTracking resolvers", () => {
  beforeEach(jest.clearAllMocks);

  describe("penaltyTakersCardVisibilityTrackingResolver", () => {
    describe("when there is not cardUrn in the payload", () => {
      it("should not call the 'sendEvent' function", async () => {
        await penaltyTakersCardVisibilityTrackingResolver({ visible: true }, sendEvent);

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when visible is false in the payload", () => {
      it("should not call the 'sendEvent' function", async () => {
        await penaltyTakersCardVisibilityTrackingResolver({ cardUrn: CARD_URN, visible: false }, sendEvent);

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we are not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getPenaltyTakersCard.mockResolvedValue(null);

        await penaltyTakersCardVisibilityTrackingResolver({ cardUrn: CARD_URN, visible: true }, sendEvent);

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we are able to fetch the card data", () => {
      beforeEach(() => {
        getPenaltyTakersCard.mockResolvedValue(cardMock);
      });

      it("should call the 'sendEvent' function twice with the correct parameters", async () => {
        await penaltyTakersCardVisibilityTrackingResolver({ cardUrn: CARD_URN, visible: true }, sendEvent);

        expect(sendEvent).toHaveBeenCalledTimes(2);
        expect(sendEvent).toHaveBeenNthCalledWith(1, {
          event: "interface",
          action: "displayed",
          element_text: "penalty pusher",
          event_context: "sporting vs porto",
          game_filter: "null",
          module: "event - penalties - penalty takers",
          swimlane_type: "null",
        });
        expect(sendEvent).toHaveBeenNthCalledWith(2, {
          event: "interface",
          action: "displayed",
          element_text: "players displayed - 3",
          event_context: "sporting vs porto",
          game_filter: "null",
          module: "event - penalties - penalty takers",
          swimlane_type: "null",
        });
      });
    });
  });

  describe("penaltyTakersCardPlayerSwipeTrackingResolver", () => {
    describe("when there is not cardUrn in the payload", () => {
      it("should not call the 'sendEvent' function", async () => {
        await penaltyTakersCardPlayerSwipeTrackingResolver({ playerId: "3" }, sendEvent);

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when there is not playerId in the payload", () => {
      it("should not call the 'sendEvent' function", async () => {
        await penaltyTakersCardPlayerSwipeTrackingResolver({ cardUrn: CARD_URN }, sendEvent);

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we are not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getPenaltyTakersCard.mockResolvedValue(null);

        await penaltyTakersCardPlayerSwipeTrackingResolver({ cardUrn: CARD_URN, playerId: "3" }, sendEvent);

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we are able to fetch the card data", () => {
      beforeEach(() => {
        getPenaltyTakersCard.mockResolvedValue(cardMock);
      });

      it("should call the 'sendEvent' function twice with the correct parameters", async () => {
        await penaltyTakersCardPlayerSwipeTrackingResolver({ cardUrn: CARD_URN, playerId: "3" }, sendEvent);

        expect(sendEvent).toHaveBeenCalledTimes(2);
        expect(sendEvent).toHaveBeenNthCalledWith(1, {
          event: "interface",
          action: "swiped",
          element_text: "select a player",
          event_context: "sporting vs porto",
          game_filter: "null",
          module: "event - penalties - penalty takers",
          swimlane_type: "null",
        });
        expect(sendEvent).toHaveBeenNthCalledWith(2, {
          event: "interface",
          action: "selected",
          element_text: "select a player - kylian mbappe",
          event_context: "sporting vs porto",
          game_filter: "null",
          module: "event - penalties - penalty takers",
          swimlane_type: "null",
        });
      });
    });
  });

  describe("penaltyTakersCardSegmentChangeTrackingResolver", () => {
    describe("when there is not cardUrn in the payload", () => {
      it("should not call the 'sendEvent' function", async () => {
        await penaltyTakersCardSegmentChangeTrackingResolver({ selectedSegment: "TO_SCORE" }, sendEvent);

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we are not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getPenaltyTakersCard.mockResolvedValue(null);

        await penaltyTakersCardSegmentChangeTrackingResolver(
          { cardUrn: CARD_URN, selectedSegment: "TO_SCORE" },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we are able to fetch the card data", () => {
      beforeEach(() => {
        getPenaltyTakersCard.mockResolvedValue(cardMock);
      });

      it("should call the 'sendEvent' function with 'to score' when changing to the 'TO_SCORE' segment", async () => {
        await penaltyTakersCardSegmentChangeTrackingResolver(
          { cardUrn: CARD_URN, selectedSegment: "TO_SCORE" },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledWith({
          event: "interface",
          action: "clicked",
          element_text: "score miss tabs - to score",
          event_context: "sporting vs porto",
          game_filter: "null",
          module: "event - penalties - penalty takers",
          swimlane_type: "null",
        });
      });

      it("should call the 'sendEvent' function with 'to miss' when changing to the 'TO_MISS' segment", async () => {
        await penaltyTakersCardSegmentChangeTrackingResolver(
          { cardUrn: CARD_URN, selectedSegment: "TO_MISS" },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledWith({
          event: "interface",
          action: "clicked",
          element_text: "score miss tabs - to miss",
          event_context: "sporting vs porto",
          game_filter: "null",
          module: "event - penalties - penalty takers",
          swimlane_type: "null",
        });
      });
    });
  });
});
