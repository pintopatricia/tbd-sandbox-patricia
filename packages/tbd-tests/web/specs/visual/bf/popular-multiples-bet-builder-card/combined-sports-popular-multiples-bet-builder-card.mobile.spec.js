const {
  getMockedImagePuppeteer,
  getMockedNotFoundImageErrorPuppeteer,
} = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const PopularBetBuilderPO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.po");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const popularBetBuilderPO = new PopularBetBuilderPO();

const MODULE_NAME = "manual_configured_popular_multiples_bet_builder";
const FIRST_MARKET_ID = 924.383914312;
const SECOND_MARKET_ID = 924.383683732;

const MEETING_MOCK = {
  __typename: "Meeting",
  urn: "ppb:meeting:30264302",
  name: "Cheltenham 18th Nov",
  country: "GB",
  countryFlag: { vector: null },
  venue: "Cheltenham",
  date: "2023-11-18T12:35:00.000Z",
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:7",
    name: "Horse Racing",
    sportId: 7,
  },
};

const COMPETITION_MOCK = {
  __typename: "Competition",
  urn: "ppb:competition:99",
  name: "Portuguese Primeira Liga",
  competitionId: 99,
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:1",
    name: "Football",
    sportId: 1,
  },
};

const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
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
                cmsConfiguredTitle: {
                  name: "Combined Sports BetBuilder",
                },
                urn: "ppb:tbd:card:popularmultiplesbetbuilder:bo-1|1|0|0",
                popularbettingopportunity: {
                  urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
                  count: 0,
                  selections: [
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                        name: "2m Listed NHF",
                        marketType: "WIN",
                        marketTypeName: "Win",
                        bettingType: "ODDS",
                        hierarchy: {
                          __typename: "RaceHierarchy",
                          race: {
                            __typename: "Race",
                            urn: "ppb:race:32806371.1605",
                            startTime: "2023-11-18T16:05:00.000Z",
                            name: "Cheltenham 18th Nov",
                            raceId: "32806371.1605",
                            meeting: MEETING_MOCK,
                          },
                          meeting: MEETING_MOCK,
                        },
                        sport: {
                          __typename: "Sport",
                          urn: "ppb:eventType:7",
                          name: "Horse Racing",
                          sportId: 7,
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/50016247`,
                            selectionId: 1,
                            name: "Larchmont Lass",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/50016247`,
                        selectionId: 50016247,
                      },
                      raceRunner: {
                        details: {
                          silk: "http://example.test.com/mockedImage/image.png",
                          jockeyName: "B. Hayes",
                          trainerName: "W. P. Mullins, Ireland",
                        },
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                        name: "Match Odds 90",
                        marketType: "MATCH_ODDS_90",
                        marketTypeName: null,
                        bettingType: "ODDS",
                        hierarchy: {
                          __typename: "EventCompetitionHierarchy",
                          sportevent: {
                            urn: `ppb:event:321`,
                            eventId: 321,
                            name: "Moreirense v Benfica",
                            openDate: "2023-12-03T18:00:00.000Z",
                            competition: COMPETITION_MOCK,
                          },
                          competition: COMPETITION_MOCK,
                          sport: {
                            __typename: "Sport",
                            urn: "ppb:eventType:1",
                            name: "Football",
                            sportId: 1,
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48783`,
                            selectionId: 48783,
                            name: "Benfica",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48783`,
                        selectionId: 48783,
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
  runner: { marketId: FIRST_MARKET_ID, selectionId: 50016247 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const SECOND_RUNNER_SIB = {
  runner: { marketId: SECOND_MARKET_ID, selectionId: 48783 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 3.3 } },
    decimalDisplayOdds: { decimalOdds: 3.3 },
  },
};

const POPULAR_MULTIPLES_BET_BUILDER_COMBINATION = {
  betType: "DOUBLE",
  averageOdds: 56.39,
  winAverageOdds: 56.39,
  legCombinations: [
    {
      runners: [FIRST_RUNNER_SIB.runner],
    },

    {
      runners: [SECOND_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 56.39 } },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 56.39 } },
  },
};

const SIB_MOCK = {
  betCombinations: [POPULAR_MULTIPLES_BET_BUILDER_COMBINATION],
  runnerOdds: [FIRST_RUNNER_SIB, SECOND_RUNNER_SIB],
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
  ],
};

describe("Manual Configured PopularMultiplesBetBuilder", () => {
  describe("When the user is on a given page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getMockedNotFoundImageErrorPuppeteer({ path: ".*notWorkingImage.*" }));
      await mockService.mockFonts(getMockFonts());
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilEquals(popularBetBuilderPO.popularBetBuilderBetButton, "Add to Betslip at 56.39");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1509]_should_render_a_manual_configured_popular_multiples_bet_builder_card_with_combined_sports`,
      );
    });

    it("[PRPI-1509]_should_render_a_manual_configured_popular_multiples_bet_builder_card_with_combined_sports", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1509]_should_render_a_manual_configured_popular_multiples_bet_builder_card_with_combined_sports`,
        ),
      ).toBe(0);
    });
  });
});
