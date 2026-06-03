const { ScrollableSwimlanePO } = require("../../../../../page-objects");
const { EventPagePO } = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[0]);
const secondMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[1]);
const thirdMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[2]);
const fourthMarketsSwimlane = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[3]);

const mockService = new MockService();

const EVENT_ID = "29794571";
const EXCHANGE_MARKET_ID = "1.170397719";
const SPORTSBOOK_MARKET_ID = "924.230106153";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {},
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture;${EVENT_ID}`,
        sportevent: {
          __typename: "SportsEvent",
          urn: `ppb:event:${EVENT_ID}`,
          competition: {
            __typename: "Competition",
            urn: "ppb:competition:123",
            sport: {
              urn: "ppb:sport:1",
              name: "sportName",
            },
          },
        },
        fixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: {
            name: "Chelsea",
            color: null,
            crest: null,
          },
          away: {
            name: "Tottenham",
            color: null,
            crest: null,
          },
          scheduledAt: "2020-02-22T12:30",
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
          },
          penaltyShootout: null,
        },
      },
    },
    null,
    null,
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture;${EVENT_ID}`,
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#29794497",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:overUnderMarketGroup#29794497",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup#29794497",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:marketsByEventAndMarketType:bothTeamsToScoreMarketGroup#29794497",
      },
    },
  ],
};

const FETCH_MORE_CARDS_MOCK = {
  cards: [
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#29794497",
      cardGroupTitle: "Match Odds Markets",
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
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                    bettingType: "ODDS",
                    eachWayDivisor: null,
                    numberOfWinners: 1,
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
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:marketsByEventAndMarketType:overUnderMarketGroup#29794497",
      cardGroupTitle: "Over Under Goals Markets",
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
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                    bettingType: "ODDS",
                    numberOfWinners: 1,
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
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                    bettingType: "ODDS",
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
        ],
      },
    },
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup#29794497",
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
                        runnerURN: "ppb:sbkRunner:924.230106153/1063100",
                        name: "2-0",
                        selectionId: 1063100,
                        handicap: 0,
                        resultType: "SCORE",
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.230106153/1063100",
                        name: "2-1",
                        selectionId: 1063100,
                        handicap: 0,
                        resultType: "SCORE",
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:sbkRunner:924.230106153/1063100" },
                    { runnerURN: "ppb:sbkRunner:924.230106153/1063100" },
                    { runnerURN: "ppb:sbkRunner:924.230106153/1063100" },
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
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:marketsByEventAndMarketType:bothTeamsToScoreMarketGroup#29794497",
      cardGroupTitle: "Both Teams to Score",
      full: {
        edges: [
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.230105773",
              cardTitle: "Both Teams to Score",
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.230105773",
                    name: "Both Teams to Score",
                    marketType: "BOTH_TEAMS_TO_SCORE",
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
                        name: "Yes",
                        selectionId: 1063100,
                        handicap: 0,
                        resultType: null,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.230106153/1063100",
                        name: "No",
                        selectionId: 1063100,
                        handicap: 0,
                        resultType: null,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:sbkRunner:924.230106153/1063100" },
                    { runnerURN: "ppb:sbkRunner:924.230106153/1063100" },
                    { runnerURN: "ppb:sbkRunner:924.230106153/1063100" },
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
      ],
    },
  ],
};

describe("Given I am on a Football Event Page And BFF retrieves 4 market main swimlanes", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));

    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(FETCH_MORE_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));

    await browser.url(routes.getEventViewUrl(EVENT_ID));

    await browser.waitUntilDisplayed(firstMarketsSwimlane.element);
  });

  it("[PRPI-6122] And I should see 'Match Odds Markets' main market swimlane on the viewport", async () => {
    expect(await firstMarketsSwimlane.element.isDisplayedInViewport()).toBe(true);
  });

  it("[PRPI-6123] And I should see a total of 4 market main swimlanes on the page", async () => {
    // "'Match Odds markets', 'Over Under Goals Markets', 'Correct Score' and 'Both Teams to Score'"
    expect(await firstMarketsSwimlane.title.getText()).toBe("Match Odds Markets");
    expect(await secondMarketsSwimlane.title.getText()).toBe("Over Under Goals Markets");
    expect(await thirdMarketsSwimlane.title.getText()).toBe("Correct Score");
    expect(await fourthMarketsSwimlane.title.getText()).toBe("Both Teams to Score");
  });
});
