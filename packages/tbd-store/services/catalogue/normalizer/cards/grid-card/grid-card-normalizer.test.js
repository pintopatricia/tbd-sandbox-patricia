import victim from "./grid-card-normalizer";

const BFF_RESPONSE = {
  __typename: "MarketGridCard",
  urn: "ppb:tbd:card:marketgrid:12345",
  markets: [
    {
      displayLabel: {
        __typename: "DisplayNameTitle",
        name: "1+",
      },
      market: {
        urn: "ppb:sbkMarket:924.1111",
        name: "Market 1",
      },
    },
    {
      displayLabel: null,
      market: {
        urn: "ppb:sbkMarket:924.2222",
        name: "Market 2",
      },
    },
  ],
  runners: [
    {
      displayName: {
        __typename: "DisplayNameTitle",
        name: "Under",
        participantId: "1",
      },
      runner: {
        runnerURN: "ppb:sbkRunner:924.1111/123456",
        name: "First runner",
        participantId: "2",
      },
    },
  ],
  players: {
    edges: [
      {
        node: {
          urn: "ppb:tbd:footballplayer:fixture:2960|35426570",
          __typename: "FootballPlayerFixtureContext",
          team: {
            id: "3843",
          },
          player: {
            urn: "ppb:tbd:player:2960|35426570",
            __typename: "FootballPlayerFixture",
            id: "2960",
            name: "Harry Kane",
            seasonStats: {
              matchesPlayed: 0,
              averages: {
                shotsOnTarget: 0,
                totalShots: 0,
                goals: 0,
                yellowCards: 0,
                redCards: 0,
                yellowRedCards: 0,
                firstGoalScored: 0,
                lastGoalScored: 0,
                foulsPerMatch: null,
                fouls: 0,
                foulsWon: 0,
                passes: 0,
                assists: 0,
              },
            },
          },
        },
      },
    ],
  },
  firstPlayer: {
    edges: [
      {
        node: {
          __typename: "FootballPlayerFixtureContext",
          urn: "ppb:tbd:footballplayer:fixture:2960|35426570",
          fixture: {
            urn: "ppb:fixture:35426570",
            home: {
              id: "3843",
              jerseys: [
                {
                  color: "2D4781",
                  url: "https://content-s3.betfair.com/jic/uki/bf/England_Home_Jersey.png",
                  type: "HOME",
                },
                {
                  color: "605168",
                  url: "https://content-s3.betfair.com/jic/uki/bf/England_Away_Jersey.png",
                  type: "AWAY",
                },
              ],
            },
            away: {
              id: "5000",
              jerseys: [
                {
                  color: "908D8B",
                  url: "https://content-s3.betfair.com/jic/uki/bf/Fallback_Jersey.png",
                  type: "HOME",
                },
                {
                  color: "908D8B",
                  url: "https://content-s3.betfair.com/jic/uki/bf/Fallback_Jersey.png",
                  type: "AWAY",
                },
              ],
            },
          },
        },
      },
    ],
  },
};

describe("MarketGridCard normalizer", () => {
  describe("normalizeMarketGridCardFragmentIntoMarketGridCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = victim(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "MarketGridCard",
        urn: "ppb:tbd:card:marketgrid:12345",
        numberOfItemsToDisplay: undefined,
        layout: undefined,
        stat: undefined,
        infoBlurbs: [],
        markets: [{ displayLabel: "1+", urn: "ppb:sbkMarket:924.1111" }, { urn: "ppb:sbkMarket:924.2222" }],
        runners: [
          {
            marketURN: undefined,
            name: "Under",
            participantId: "2",
            selectionId: undefined,
            urn: "ppb:sbkRunner:924.1111/123456",
          },
        ],
        firstPlayer: {
          typename: "FootballPlayerFixtureContext",
          urn: "ppb:tbd:footballplayer:fixture:2960|35426570",
        },
        players: [
          {
            typename: "FootballPlayerFixtureContext",
            urn: "ppb:tbd:footballplayer:fixture:2960|35426570",
          },
        ],
      });
    });
  });
});
