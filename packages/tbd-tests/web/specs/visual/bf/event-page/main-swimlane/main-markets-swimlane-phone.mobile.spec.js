const { EventPagePO, ScrollableSwimlanePO } = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const secondMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[1]);
const thirdMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[2]);

const mockService = new MockService();

const EVENT_ID = "29794571";
const EXCHANGE_MARKET_ID = "1.170397719";
const SPORTSBOOK_MARKET_ID = "924.230106153";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup##29794497",
        cardGroupTitle: null,
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170397719;924.230105977",
                cardTitle: "Match Odds",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170397719",
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/5340398/0",
                          name: "RB Leipzig",
                          selectionId: 5340398,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/44520/0",
                          name: "Freiburg",
                          selectionId: 44520,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170397719/5340398/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/44520/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/58805/0" },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170397719;924.230105977",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:overUnderMarketGroup##29794497",
        cardGroupTitle: null,
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230106035",
                cardTitle: "Over/Under 0.5 Goals",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170397719",
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      numberOfWinners: 1,
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/5340398/0",
                          name: "RB Leipzig",
                          selectionId: 5340398,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/44520/0",
                          name: "Freiburg",
                          selectionId: 44520,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170397719/5340398/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/44520/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/58805/0" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230105651",
                cardTitle: "Over/Under Total Goals 1.5",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170397719",
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/5340398/0",
                          name: "RB Leipzig",
                          selectionId: 5340398,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/44520/0",
                          name: "Freiburg",
                          selectionId: 44520,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170397719/5340398/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/44520/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/58805/0" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170397729;924.230105746",
                cardTitle: "Over/Under 2.5 Goals",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170397719",
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/5340398/0",
                          name: "RB Leipzig",
                          selectionId: 5340398,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/44520/0",
                          name: "Freiburg",
                          selectionId: 44520,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170397719/5340398/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/44520/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/58805/0" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230105782",
                cardTitle: "Over/Under Total Goals 3.5",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170397719",
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/5340398/0",
                          name: "RB Leipzig",
                          selectionId: 5340398,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/44520/0",
                          name: "Freiburg",
                          selectionId: 44520,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170397719/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170397719/5340398/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/44520/0" },
                      { runnerURN: "ppb:excRunner:1.170397719/58805/0" },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230106035",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230105651",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:1.170397729;924.230105746",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230105782",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230105533",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230106095",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230105835",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230106066",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup##29794497",
        cardGroupTitle: "Correct Score",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230106153",
                cardTitle: "Correct Score",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.230106153",
                      name: "Correct Score",
                      marketType: "CORRECT_SCORE",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.230106153/1063100",
                          name: "1-0",
                          selectionId: 1063100,
                          handicap: 0,
                          resultType: "SCORE",
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.230106153/1063101",
                          name: "2-0",
                          selectionId: 1063100,
                          handicap: 0,
                          resultType: "SCORE",
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.230106153/1063102",
                          name: "2-1",
                          selectionId: 1063100,
                          handicap: 0,
                          resultType: "SCORE",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.230106153/1063100" },
                      { runnerURN: "ppb:sbkRunner:924.230106153/1063101" },
                      { runnerURN: "ppb:sbkRunner:924.230106153/1063102" },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230106153",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:bothTeamsToScoreMarketGroup##29794497",
        cardGroupTitle: "Both Teams to Score",
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230105773",
                cardTitle: "Both Teams to Score",
                viewLinks: [
                  {
                    viewUrn: "ppb:tbd:view:market:924.230105773",
                    viewUrl: routes.getMarketViewUrl("924230105773"),
                  },
                ],

                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.230105773",
                      name: "Both Teams to Score",
                      marketType: "BOTH_TEAMS_TO_SCORE",
                      liveData: {
                        inplay: false,
                      },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Soccer",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:59",
                          name: "German Bundesliga",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29794497",
                          name: "RB Leipzig v Freiburg",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.230105773/30246",
                          name: "Yes",
                          selectionId: 30246,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.230105773/30247",
                          name: "No",
                          selectionId: 30247,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.230105773/30246" },
                      { runnerURN: "ppb:sbkRunner:924.230105773/30247" },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.230105773",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup##29794497",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:overUnderMarketGroup##29794497",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup##29794497",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:bothTeamsToScoreMarketGroup##29794497",
      },
    },
  ],
};

const FETCH_MORE_OVER_UNDER_CARDS_MOCK = {
  cards: [
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:market:924.230105533",
      cardTitle: "Over/Under Total Goals 4.5",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.170397719",
            name: "Match Odds",
            marketType: "MATCH_ODDS",
            bettingType: "ODDS",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/5340398/0",
                name: "RB Leipzig",
                selectionId: 5340398,
                handicap: 0,
                resultType: null,
              },
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/44520/0",
                name: "Freiburg",
                selectionId: 44520,
                handicap: 0,
                resultType: null,
              },
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/58805/0",
                name: "The Draw",
                selectionId: 58805,
                handicap: 0,
                resultType: null,
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:excRunner:1.170397719/5340398/0" },
            { runnerURN: "ppb:excRunner:1.170397719/44520/0" },
            { runnerURN: "ppb:excRunner:1.170397719/58805/0" },
          ],
        },
      },
    },
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:market:924.230106095",
      cardTitle: "Over/Under Total Goals 5.5",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.170397719",
            name: "Match Odds",
            marketType: "MATCH_ODDS",
            bettingType: "ODDS",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/5340398/0",
                name: "RB Leipzig",
                selectionId: 5340398,
                handicap: 0,
                resultType: null,
              },
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/44520/0",
                name: "Freiburg",
                selectionId: 44520,
                handicap: 0,
                resultType: null,
              },
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/58805/0",
                name: "The Draw",
                selectionId: 58805,
                handicap: 0,
                resultType: null,
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:excRunner:1.170397719/5340398/0" },
            { runnerURN: "ppb:excRunner:1.170397719/44520/0" },
            { runnerURN: "ppb:excRunner:1.170397719/58805/0" },
          ],
        },
      },
    },
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:market:924.230105835",
      cardTitle: "Over/Under Total Goals 6.5",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.170397719",
            name: "Match Odds",
            marketType: "MATCH_ODDS",
            bettingType: "ODDS",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/5340398/0",
                name: "RB Leipzig",
                selectionId: 5340398,
                handicap: 0,
                resultType: null,
              },
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/44520/0",
                name: "Freiburg",
                selectionId: 44520,
                handicap: 0,
                resultType: null,
              },
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/58805/0",
                name: "The Draw",
                selectionId: 58805,
                handicap: 0,
                resultType: null,
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:excRunner:1.170397719/5340398/0" },
            { runnerURN: "ppb:excRunner:1.170397719/44520/0" },
            { runnerURN: "ppb:excRunner:1.170397719/58805/0" },
          ],
        },
      },
    },
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:market:924.230106066",
      cardTitle: "Over/Under Total Goals 7.5",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.170397719",
            name: "Match Odds",
            marketType: "MATCH_ODDS",
            bettingType: "ODDS",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/5340398/0",
                name: "RB Leipzig",
                selectionId: 5340398,
                handicap: 0,
                resultType: null,
              },
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/44520/0",
                name: "Freiburg",
                selectionId: 44520,
                handicap: 0,
                resultType: null,
              },
              {
                __typename: "Runner",
                runnerURN: "ppb:excRunner:1.170397719/58805/0",
                name: "The Draw",
                selectionId: 58805,
                handicap: 0,
                resultType: null,
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:excRunner:1.170397719/5340398/0" },
            { runnerURN: "ppb:excRunner:1.170397719/44520/0" },
            { runnerURN: "ppb:excRunner:1.170397719/58805/0" },
          ],
        },
      },
    },
  ],
};

const ERO_MOCK = [
  {
    marketId: EXCHANGE_MARKET_ID,
    runners: [
      {
        selectionId: "5340398",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "44520",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 3.1, size: 300 }],
        availableToLay: [{ price: 3.2, size: 310 }],
      },
    ],
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "1063100",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "1063101",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "1063102",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const MODULE_NAME = "event_page_main_markets";

describe("Given I am on a Football Event Page And BFF retrieves 4 market main swimlanes", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockFonts(getMockFonts());

    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(FETCH_MORE_OVER_UNDER_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));

    await browser.url(routes.getEventViewUrl(EVENT_ID));

    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1620]_should_render_two_swimlanes`);
  });

  it("[PRPI-1620]_should_render_two_swimlanes", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1620]_should_render_two_swimlanes`)).toBe(0);
  });

  describe("When I scroll to the second market main swimlane", () => {
    beforeAll(async () => {
      await eventPagePO.scrollableSwimlanes[1].scrollIntoView({ block: "center" });
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1621]_should_render_second_swimlane`);
    });

    it("[PRPI-1621]_should_render_second_swimlane", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1621]_should_render_second_swimlane`)).toBe(0);
    });

    // TODO: inconsistency when run locally and pipe
    xdescribe("When I swipe through that second swimlane till the last card", () => {
      beforeAll(async () => {
        // scroll with smooth behavior so useLazyLoading triggers request for next 4 items
        await secondMarketsSwimlane.scrollItems[7].scrollIntoView({ behavior: "smooth", block: "center" });
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1622]_should_render_seventh_card_of_second_swimlane`);
      });

      it("[PRPI-1622]_should_render_seventh_card_of_second_swimlane", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1622]_should_render_seventh_card_of_second_swimlane`),
        ).toBe(0);
      });

      describe("When I scroll down till the third market main swimlane 'Correct Score'", () => {
        beforeAll(async () => {
          await thirdMarketsSwimlane.element.scrollIntoView({ block: "center" });
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1623]_should_render_third_swimlane`);
        });

        it("[PRPI-1623]_should_render_third_swimlane", async () => {
          expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1623]_should_render_third_swimlane`)).toBe(0);
        });
      });
    });
  });
});
