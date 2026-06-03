const {
  getMockedImagePuppeteer,
  getMockedNotFoundImageErrorPuppeteer,
} = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { MultiBetBuilderPO, SportsbookBetButtonPO, SportsbookPlacePanelPO } = require("../../../../page-objects");
const PopularBetBuilderPO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.po");
const { getSportsLayout, getMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const popularBetBuilderPO = new PopularBetBuilderPO();
const sportsbookBetButtonPO = new SportsbookBetButtonPO(popularBetBuilderPO.popularBetBuilderBetButton);

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const multiBetBuilderPO = new MultiBetBuilderPO(sportsbookPlacePanelPO.element);

const MODULE_NAME = "popular_multiples_bet_builder";
const EVENT_TYPE_ID = 1;
const FIRST_MARKET_ID = 924.1;
const SECOND_MARKET_ID = 924.2;
const THIRD_MARKET_ID = 924.3;

const MEETING_MOCK = {
  __typename: "Meeting",
  urn: "ppb:meeting:30264302",
  name: "Kemp 3rd Feb",
  country: "GB",
  countryFlag: { vector: null },
  venue: "Kempton",
  date: "2021-02-03T16:55:00.000Z",
};

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
                  id: "bo-1|1|0|0",
                  count: 435,
                  type: "POPULAR",
                  selections: [
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                        name: "Anytime Goalscorer",
                        hierarchy: {
                          __typename: "RaceHierarchy",
                          race: {
                            __typename: "Race",
                            urn: "ppb:race:30264302.1755",
                            startTime: "2021-02-03T14:55:00.000Z",
                            name: "5f App Hcap",
                            meeting: MEETING_MOCK,
                          },
                          meeting: MEETING_MOCK,
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
                      raceRunner: {
                        details: {
                          silk: "http://example.test.com/mockedImage/image.png",
                        },
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                        name: "Missed Shots Over/Under 100.5",
                        hierarchy: {
                          __typename: "RaceHierarchy",
                          race: {
                            __typename: "Race",
                            urn: "ppb:race:30264302.1756",
                            startTime: "2021-02-03T17:55:00.000Z",
                            name: "5f Hcap",
                            meeting: MEETING_MOCK,
                          },
                          meeting: MEETING_MOCK,
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
                      raceRunner: {
                        details: {
                          silk: "http://example.test.com/notWorkingImage/image.png",
                        },
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                        name: "Third Market",
                        hierarchy: {
                          __typename: "RaceHierarchy",
                          race: {
                            __typename: "Race",
                            urn: "ppb:race:30264302.1757",
                            startTime: "2021-02-03T18:20:00.000Z",
                            name: "6f Mdn Stks",
                            meeting: MEETING_MOCK,
                          },
                          meeting: MEETING_MOCK,
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
                      raceRunner: {
                        details: {
                          silk: "http://example.test.com/mockedImage/image.png",
                        },
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

const SINGLE_BET_COMBINATION = [
  {
    legCombinations: [
      {
        runners: [FIRST_RUNNER_SIB.runner],
        legType: "SIMPLE_SELECTION",
      },
    ],

    averageOdds: 1.1,
    winAverageOdds: 1.1,
    winAvgOdds: {
      trueOdds: FIRST_RUNNER_SIB.odds.trueOdds,
      decimalDisplayOdds: FIRST_RUNNER_SIB.odds.decimalDisplayOdds,
    },
  },
  {
    legCombinations: [
      {
        runners: [SECOND_RUNNER_SIB.runner],
        legType: "SIMPLE_SELECTION",
      },
    ],

    averageOdds: 2.2,
    winAverageOdds: 2.2,
    winAvgOdds: {
      trueOdds: SECOND_RUNNER_SIB.odds.trueOdds,
      decimalDisplayOdds: SECOND_RUNNER_SIB.odds.decimalDisplayOdds,
    },
  },
  {
    legCombinations: [
      {
        runners: [THIRD_RUNNER_SIB.runner],
        legType: "SIMPLE_SELECTION",
      },
    ],

    averageOdds: 3.3,
    winAverageOdds: 3.3,
    winAvgOdds: {
      trueOdds: THIRD_RUNNER_SIB.odds.trueOdds,
      decimalDisplayOdds: THIRD_RUNNER_SIB.odds.decimalDisplayOdds,
    },
  },
];

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
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 56.39 } },
    decimalDisplayOdds: { decimalOdds: 56.39 },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 56.39 } },
  },
};

const SIB_MOCK = {
  betCombinations: [...SINGLE_BET_COMBINATION, POPULAR_MULTIPLES_BET_BUILDER_COMBINATION],
  runnerOdds: [FIRST_RUNNER_SIB, SECOND_RUNNER_SIB, THIRD_RUNNER_SIB],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: `${FIRST_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
        },
      ],
    },
    {
      marketId: `${SECOND_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
          },
        },
      ],
    },
    {
      marketId: `${THIRD_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.3 },
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
  ],
};

describe("PopularBetBuilder", () => {
  describe("Racing Bet Builder", () => {
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
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1511]_should_render_popular_multiples_bet_builder_card`);
    });

    it("[PRPI-1511]_should_render_popular_multiples_bet_builder_card", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1511]_should_render_popular_multiples_bet_builder_card`),
      ).toBe(0);
    });

    describe("When the user clicks on the bet button", () => {
      beforeAll(async () => {
        await sportsbookBetButtonPO.element.click();
        await browser.waitUntilDisplayed(multiBetBuilderPO.element);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-4794]_the_betslip_should_display_the_multis_bet_builder`,
        );
      });

      it("[PRPI-4794]_the_betslip_should_display_the_multis_bet_builder", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-4794]_the_betslip_should_display_the_multis_bet_builder`),
        ).toBe(0);
      });
    });
  });
});
