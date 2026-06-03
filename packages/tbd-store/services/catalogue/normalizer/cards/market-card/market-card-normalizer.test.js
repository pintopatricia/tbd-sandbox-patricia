import { DisplayMode } from "../../../../../state/layout/views/ViewLink.types";
import normalizeMarketCardFragmentIntoMarketCard from "./market-card-normalizer";

const BFF_RESPONSE = {
  __typename: "MarketCard",
  urn: "ppb:tbd:card:market:1.175591575;924.245489409|15",
  cardTitle: "Win",
  viewLinks: [
    {
      viewUrn: "ppb:tbd:view:market:1.175591575",
      viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
    },
  ],
  marketsHierarchy: {
    __typename: "RaceHierarchy",
    race: {
      urn: "raceUrn",
      meeting: {
        urn: "meetingUrn",
      },
    },
  },
  displayRunners: {
    exchange: {
      market: {
        __typename: "ExchangeMarket",
        urn: "ppb:excMarket:1.175293571",
      },
      runners: [
        {
          runnerURN: "ppb:excRunner:1.175293571/36710835/0",
        },
        {
          runnerURN: "ppb:excRunner:1.175293571/36710836/0",
        },
      ],
    },
    sportsbook: {
      market: {
        __typename: "SportsbookMarket",
        urn: "ppb:sbkMarket:924.245489409",
      },
      runners: [
        {
          runnerURN: "ppb:sbkRunner:1.175293571/36710835",
          participantId: "1",
        },
        {
          runnerURN: "ppb:sbkRunner:1.175293571/36710836",
          participantId: "2",
        },
      ],
    },
  },
  runnerViewLinks: [
    {
      runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
      viewUrl: "Not Implemented",
      viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
    },
  ],
  numberOfItemsToDisplay: 4,
  marketPromo: {
    title: "market title",
    description: "market description",
    signposting: "EXTRA_PLACES",
  },
  blurbs: [
    null,
    {
      isCollapsed: false,
      title: {
        __typename: "DisplayNameTitle",
        name: "header Name",
      },
      description: {
        __typename: "DisplayNameTitle",
        name: "body Name",
      },
      supplementaryInfo: {
        label: {
          __typename: "DisplayNameTitle",
          name: "link label",
        },
        viewLink: {
          viewUrn: "view urn",
          viewUrl: "view url",
          viewDisplayMode: DisplayMode.SelfBrowser,
        },
      },
    },
    {
      title: {
        __typename: "DisplayNameTitle",
        name: "header Name",
      },
      description: {
        __typename: "DisplayNameTitle",
        name: "body Name",
      },
    },
    {
      title: {
        __typename: "DisplayNameTitle",
        name: "header Name",
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

describe("MarketCard normalizer", () => {
  describe("normalizeMarketCardFragmentIntoMarketCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeMarketCardFragmentIntoMarketCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.175591575;924.245489409|15",
        title: "Win",
        runnerViewLinks: {
          "ppb:excRunner:1.175591575/19159752/0": {
            runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
          },
        },
        viewLinks: [
          {
            viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
            viewUrn: "ppb:tbd:view:market:1.175591575",
          },
        ],
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1.175293571",
            runners: [{ urn: "ppb:excRunner:1.175293571/36710835/0" }, { urn: "ppb:excRunner:1.175293571/36710836/0" }],
          },
          sportsbook: {
            market: "ppb:sbkMarket:924.245489409",
            runners: [
              { participantId: "1", urn: "ppb:sbkRunner:1.175293571/36710835" },
              { participantId: "2", urn: "ppb:sbkRunner:1.175293571/36710836" },
            ],
          },
        },
        numberOfItemsToDisplay: 4,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
          isExpanded: false,
        },
        infoBlurbs: [
          {
            title: "header Name",
            description: "body Name",
            isExpanded: true,
            link: {
              text: "link label",
              url: "view url",
              displayMode: DisplayMode.SelfBrowser,
            },
            signposting: "MARKET_RULES",
          },
          {
            title: "header Name",
            description: "body Name",
            isExpanded: false,
            link: undefined,
            signposting: "MARKET_RULES",
          },
          {
            title: "header Name",
            description: undefined,
            isExpanded: false,
            link: undefined,
            signposting: "MARKET_RULES",
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

    it("should correctly transform and return the data object with undefined variables", () => {
      const { data } = normalizeMarketCardFragmentIntoMarketCard({
        ...BFF_RESPONSE,
        displayRunners: {},
        marketPromo: undefined,
        blurbs: [],
        players: undefined,
        firstPlayer: undefined,
      });

      expect(data).toEqual({
        typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.175591575;924.245489409|15",
        title: "Win",
        viewLinks: [
          {
            viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
            viewUrn: "ppb:tbd:view:market:1.175591575",
          },
        ],
        displayRunners: {},
        runnerViewLinks: {
          "ppb:excRunner:1.175591575/19159752/0": {
            runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
          },
        },
        numberOfItemsToDisplay: 4,
        infoBlurbs: [],
        firstPlayer: undefined,
        players: undefined,
      });
    });

    it("should correctly transform and return the data object", () => {
      const { data } = normalizeMarketCardFragmentIntoMarketCard({
        ...BFF_RESPONSE,
        displayRunners: {
          exchange: {
            market: {
              urn: "ppb:excMarket:1.229209252",
            },
            runners: [],
          },
          sportsbook: {
            market: {
              urn: "ppb:sbkMarket:924.229209259",
            },
            runners: [],
          },
        },
      });

      expect(data).toEqual({
        typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.175591575;924.245489409|15",
        viewLinks: [
          {
            viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
            viewUrn: "ppb:tbd:view:market:1.175591575",
          },
        ],
        title: "Win",
        runnerViewLinks: {
          "ppb:excRunner:1.175591575/19159752/0": {
            runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
          },
        },
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1.229209252",
            runners: [],
          },
          sportsbook: {
            market: "ppb:sbkMarket:924.229209259",
            runners: [],
          },
        },
        numberOfItemsToDisplay: 4,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
          isExpanded: false,
        },
        infoBlurbs: [
          {
            title: "header Name",
            description: "body Name",
            isExpanded: true,
            link: {
              text: "link label",
              url: "view url",
              displayMode: DisplayMode.SelfBrowser,
            },
            signposting: "MARKET_RULES",
          },
          {
            title: "header Name",
            description: "body Name",
            isExpanded: false,
            signposting: "MARKET_RULES",
          },
          {
            title: "header Name",
            isExpanded: false,
            signposting: "MARKET_RULES",
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

  describe("when there's no numberOfItemsToDisplay", () => {
    it("should not keep any 'numberOfItemsToDisplay' information", () => {
      const UPDATE_BFF_RESPONSE = {
        ...BFF_RESPONSE,
        cashoutQuotes: null,
        marketsHierarchy: {},
      };
      const { data } = normalizeMarketCardFragmentIntoMarketCard(UPDATE_BFF_RESPONSE);

      expect(data).toEqual(
        expect.not.objectContaining({
          numberOfItemsToDisplay: undefined,
        }),
      );
    });
  });
});
