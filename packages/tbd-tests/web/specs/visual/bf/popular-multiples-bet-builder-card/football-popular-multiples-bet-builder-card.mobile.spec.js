const {
  getMockedImagePuppeteer,
  getMockedNotFoundImageErrorPuppeteer,
} = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const PopularBetBuilderPO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.po");
const { getSportsLayout, getMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const popularBetBuilderPO = new PopularBetBuilderPO();

const MODULE_NAME = "football_popular_multiples_bet_builder";
const EVENT_TYPE_ID = 1;
const EVENT_ID = 12345;
const OTHER_EVENT_ID = 54321;
const FIRST_MARKET_ID = 924.1;
const SECOND_MARKET_ID = 924.2;
const THIRD_MARKET_ID = 924.3;
const FOURTH_MARKET_ID = 924.4;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "PopularSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:popularSwimlane:1",
        title: "Popular Bets",
        full: {
          edges: [
            {
              node: {
                __typename: "PopularMultiplesBetBuilderCard",
                urn: "ppb:tbd:card:popularmultiplesbetbuilder:bo-1|1|0|0",
                popularbettingopportunity: {
                  urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
                  count: 435,
                  selections: [
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FOURTH_MARKET_ID}`,
                        name: "Anytime Goalscorer",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${OTHER_EVENT_ID}`,
                            openDate: "1985-02-05T15:00:00.000Z",
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/4`,
                            selectionId: 4,
                            name: "Today at Oliveira",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/4`,
                        selectionId: 4,
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                        name: "Anytime Goalscorer",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                            selectionId: 1,
                            name: "Mega Pinto",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                        selectionId: 1,
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                        name: "Anytime Goalscorer",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                            selectionId: 2,
                            name: "Super Santos",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                        selectionId: 2,
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                        name: "Anytime Goalscorer",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
                            selectionId: 3,
                            name: "Fastest Jorge",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
                        selectionId: 3,
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "PopularMultiplesBetBuilderCard",
                urn: "ppb:tbd:card:popularmultiplesbetbuilder:bo-1|1|0|0",
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
        __typename: "PopularSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:popularSwimlane:1",
      },
    },
  ],
};

const FIRST_RUNNER_SIB = {
  runner: { marketId: FIRST_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const SECOND_RUNNER_SIB = {
  runner: { marketId: SECOND_MARKET_ID, selectionId: 2 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.2 } },
    decimalDisplayOdds: { decimalOdds: 2.2 },
  },
};

const THIRD_RUNNER_SIB = {
  runner: { marketId: THIRD_MARKET_ID, selectionId: 3 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 3.3 } },
    decimalDisplayOdds: { decimalOdds: 3.3 },
  },
};

const FOURTH_RUNNER_SIB = {
  runner: { marketId: FOURTH_MARKET_ID, selectionId: 4 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 4.4 } },
    decimalDisplayOdds: { decimalOdds: 4.4 },
  },
};

const POPULAR_MULTIPLES_BET_BUILDER_COMBINATION = {
  betType: "TREBLE",
  features: ["SGM"],
  averageOdds: 56.39,
  winAverageOdds: 56.39,
  legCombinations: [
    {
      runners: [FIRST_RUNNER_SIB.runner],
    },
    {
      runners: [SECOND_RUNNER_SIB.runner],
    },
    {
      runners: [THIRD_RUNNER_SIB.runner],
    },
    {
      runners: [FOURTH_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 56.39 } },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 56.39 } },
  },
};

const SIB_MOCK = {
  betCombinations: [POPULAR_MULTIPLES_BET_BUILDER_COMBINATION],
  runnerOdds: [FIRST_RUNNER_SIB, SECOND_RUNNER_SIB, THIRD_RUNNER_SIB],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: `${FIRST_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: FIRST_RUNNER_SIB.runner.selectionId,
          runnerOdds: {
            decimalDisplayOdds: FIRST_RUNNER_SIB.odds.decimalDisplayOdds,
          },
        },
      ],
    },
    {
      marketId: `${SECOND_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: SECOND_RUNNER_SIB.runner.selectionId,
          runnerOdds: {
            decimalDisplayOdds: SECOND_RUNNER_SIB.odds.decimalDisplayOdds,
          },
        },
      ],
    },
    {
      marketId: `${THIRD_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: THIRD_RUNNER_SIB.runner.selectionId,
          runnerOdds: {
            decimalDisplayOdds: THIRD_RUNNER_SIB.odds.decimalDisplayOdds,
          },
        },
      ],
    },
    {
      marketId: `${FOURTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: FOURTH_RUNNER_SIB.runner.selectionId,
          runnerOdds: {
            decimalDisplayOdds: FOURTH_RUNNER_SIB.odds.decimalDisplayOdds,
          },
        },
      ],
    },
  ],
};

const GET_MARKETS_MOCK = {
  markets: [
    { urn: `ppb:sbkMarket:${FIRST_MARKET_ID}` },
    { urn: `ppb:sbkMarket:${SECOND_MARKET_ID}` },
    { urn: `ppb:sbkMarket:${THIRD_MARKET_ID}` },
    { urn: `ppb:sbkMarket:${FOURTH_MARKET_ID}` },
  ],
};

describe("PopularBetBuilder", () => {
  describe("When the user is on a given page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getMockedNotFoundImageErrorPuppeteer({ path: ".*notWorkingImage.*" }));
      await mockService.mockFonts(getMockFonts());
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(popularBetBuilderPO.popularBetBuilderBetButton, "Add to Betslip at 56.39");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1510]_should_render_popular_multiples_bet_builder_card`);
    });

    it("[PRPI-1510]_should_render_popular_multiples_bet_builder_card", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1510]_should_render_popular_multiples_bet_builder_card`),
      ).toBe(0);
    });
  });
});
