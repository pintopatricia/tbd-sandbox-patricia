import obbEventPopularsCard from "./obb-event-populars-card-reducer";

const obbEventPopularsCardMock = {
  typename: "ObbEventPopularsCard",
  urn: "eventPopularsCard:urn2",
  title: "Popular Bets",
  badgeLabel: "Hot",
  sportEvent: "sportEvent:urn:5678",
  showPopularEvidence: true,
  showStats: true,
  numberOfVisibleBettingOpportunities: 5,
  popularBettingOpportunities: [
    {
      betCount: 150,
      participants: [{ urn: "participant3" }, { urn: "participant4" }],
      leg: { id: "legId2" },
    },
  ],
};

const stateMock = {
  "eventPopularsCard:urn1": {
    typename: "ObbEventPopularsCard",
    urn: "eventPopularsCard:urn1",
    title: "Top Picks",
    badgeLabel: "Trending",
    sportEvent: "sportEvent:urn:1234",
    showPopularEvidence: false,
    showStats: false,
    numberOfVisibleBettingOpportunities: 3,
    popularBettingOpportunities: [
      {
        betCount: 100,
        participants: ["participant1", "participant2"],
        legId: "legId1",
      },
    ],
  },
};

describe('"obbEventPopularsCard" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = obbEventPopularsCard(undefined, {});
      expect(state).toStrictEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it("must return the new state with the new Obb Event Populars Card", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbEventPopularsCard: [obbEventPopularsCardMock],
          },
        },
      };
      const state = obbEventPopularsCard(undefined, action);
      expect(state).toStrictEqual({
        "eventPopularsCard:urn2": {
          typename: "ObbEventPopularsCard",
          urn: "eventPopularsCard:urn2",
          title: "Popular Bets",
          badgeLabel: "Hot",
          sportEvent: "sportEvent:urn:5678",
          showPopularEvidence: true,
          showStats: true,
          numberOfVisibleBettingOpportunities: 5,
          popularBettingOpportunities: [
            {
              betCount: 150,
              leg: { id: "legId2" },
              legId: "legId2",
              participants: ["participant3", "participant4"],
            },
          ],
        },
      });
    });

    it("must return current state merged with the new Obb Event Populars Card", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbEventPopularsCard: [obbEventPopularsCardMock],
          },
        },
      };

      const state = obbEventPopularsCard(stateMock, action);
      expect(state).toStrictEqual({
        ...stateMock,
        "eventPopularsCard:urn2": {
          typename: "ObbEventPopularsCard",
          urn: "eventPopularsCard:urn2",
          title: "Popular Bets",
          badgeLabel: "Hot",
          sportEvent: "sportEvent:urn:5678",
          showPopularEvidence: true,
          showStats: true,
          numberOfVisibleBettingOpportunities: 5,
          popularBettingOpportunities: [
            {
              betCount: 150,
              leg: { id: "legId2" },
              legId: "legId2",
              participants: ["participant3", "participant4"],
            },
          ],
        },
      });
    });

    it("must keep previous cards when new fetch catalogue actions are dispatched", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbEventPopularsCard: undefined,
          },
        },
      };
      const state = obbEventPopularsCard(stateMock, action);
      expect(state).toStrictEqual({
        "eventPopularsCard:urn1": {
          badgeLabel: "Trending",
          numberOfVisibleBettingOpportunities: 3,
          popularBettingOpportunities: [
            {
              betCount: 100,
              legId: "legId1",
              participants: ["participant1", "participant2"],
            },
          ],
          showPopularEvidence: false,
          showStats: false,
          sportEvent: "sportEvent:urn:1234",
          title: "Top Picks",
          typename: "ObbEventPopularsCard",
          urn: "eventPopularsCard:urn1",
        },
      });
    });
  });
});
