import { getStatsTeamsCard } from "./StatsTeamsCard.graphql";
import { statsTeamsCardExpandableButtonTrackingResolver } from "./stats-teams-card-resolvers";

jest.mock("./StatsTeamsCard.graphql", () => ({
  getStatsTeamsCard: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: () => ({
    getState: () => ({}),
  }),
}));

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createViewTypeSelector: () => () => "event",
}));

const sendEvent = jest.fn();
const cardMock = {
  __typename: "StatsTeamsCard",
  urn: "ppb:tbd:card:stats:teams:1",
  fixture: {
    urn: "ppb:fixture:123",
    sportevent: {
      urn: "ppb:sportevent:456",
      name: "Liverpool vs Manchester United",
      competition: {
        urn: "ppb:competition:789",
        name: "Premier League",
      },
    },
  },
};

describe("StatsTeamsCard Tracking resolvers", () => {
  describe("statsTeamsCardExpandableButtonTrackingResolver", () => {
    beforeEach(jest.clearAllMocks);

    describe("when we're not able to fetch the card", () => {
      it("should not call 'sendEvent' function", async () => {
        getStatsTeamsCard.mockResolvedValueOnce(null);

        await statsTeamsCardExpandableButtonTrackingResolver(
          {
            urn: "ppb:tbd:card:stats:teams:1",
            isExpanded: true,
            stat_tab: "team stats",
            stat_type: "goals",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call 'sendEvent'", async () => {
        await statsTeamsCardExpandableButtonTrackingResolver(
          {
            isExpanded: true,
            stat_tab: "team stats",
            stat_type: "goals",
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card", () => {
      describe("when the card action is closed", () => {
        it("should call sendEvent with action closed", async () => {
          getStatsTeamsCard.mockResolvedValueOnce(cardMock);

          await statsTeamsCardExpandableButtonTrackingResolver(
            {
              urn: "ppb:tbd:card:stats:teams:1",
              isExpanded: false,
              stat_tab: "team stats",
              stat_type: "goals",
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: "closed",
              element_text: "stats - team stats - goals",
              event: "interface",
              module: "event - null - null - premier league - liverpool vs manchester united - pre_match",
            }),
          );
        });
      });

      describe("when the card action is opened", () => {
        it("should call sendEvent with action opened", async () => {
          getStatsTeamsCard.mockResolvedValueOnce(cardMock);

          await statsTeamsCardExpandableButtonTrackingResolver(
            {
              urn: "ppb:tbd:card:stats:teams:1",
              isExpanded: true,
              stat_tab: "team stats",
              stat_type: "shots",
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: "opened",
              element_text: "stats - team stats - shots",
              event: "interface",
              module: "event - null - null - premier league - liverpool vs manchester united - pre_match",
            }),
          );
        });
      });
    });
  });
});
