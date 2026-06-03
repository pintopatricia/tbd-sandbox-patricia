const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const PopularBetBuilderSO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.so");
const { getSportsLayout, getMarkets, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { SportsbookPlacePanelSO, MultiBetBuilderSO, SportsbookBetButtonSO } = require("../../../../../screen-objects");

const mockService = new MockService();

const popularBetBuilderSO = new PopularBetBuilderSO();
const sportsbookBetButtonSO = new SportsbookBetButtonSO(popularBetBuilderSO.betButtonContainer);

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiBetBuilderSO = new MultiBetBuilderSO(sportsbookPlacePanelSO.element);

const MODULE_NAME = "popular_multiples_bet_builder";
const EVENT_TYPE_ID = 7;
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "Popular Bets",
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
                          silk: "http://fake-url.com",
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
                          silk: "http://fake-url.com",
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
                          silk: "http://fake-url.com",
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
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

    averageOdds: 9.5,
    winAverageOdds: 9.5,
    winAvgOdds: {
      trueOdds: {
        decimalOdds: {
          decimalOdds: 9.5,
        },
      },
      decimalDisplayOdds: {
        decimalOdds: 9.5,
      },
    },
  },
  {
    legCombinations: [
      {
        runners: [SECOND_RUNNER_SIB.runner],
        legType: "SIMPLE_SELECTION",
      },
    ],

    averageOdds: 9.5,
    winAverageOdds: 9.5,
    winAvgOdds: {
      trueOdds: {
        decimalOdds: {
          decimalOdds: 9.5,
        },
      },
      decimalDisplayOdds: {
        decimalOdds: 9.5,
      },
    },
  },
  {
    legCombinations: [
      {
        runners: [THIRD_RUNNER_SIB.runner],
        legType: "SIMPLE_SELECTION",
      },
    ],

    averageOdds: 9.5,
    winAverageOdds: 9.5,
    winAvgOdds: {
      trueOdds: {
        decimalOdds: {
          decimalOdds: 9.5,
        },
      },
      decimalDisplayOdds: {
        decimalOdds: 9.5,
      },
    },
  },
];

const POPULAR_MULTIPLES_BET_BUILDER_COMBINATION = {
  betType: "TREBLE",
  averageOdds: 56.39,
  winAverageOdds: 56.39,
  legCombinations: [],
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
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(`horse-racing/s-${EVENT_TYPE_ID}`);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilEquals(sportsbookBetButtonSO.odd, "Add to Betslip at 56.39");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4532]_should_render_popular_multiples_bet_builder_card`);
    });

    it("[PRPI-4532]_should_render_popular_multiples_bet_builder_card", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4532]_should_render_popular_multiples_bet_builder_card`))
          .misMatchPercentage,
      ).toBe(0);
    });

    describe("When the user clicks on the bet button", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(sportsbookBetButtonSO.element);
        await sportsbookBetButtonSO.element.click();
        await browser.waitUntilDisplayed(multiBetBuilderSO.element);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-4971]_the_betslip_should_display_the_multiples_bet_builder`,
        );
      });

      it("[PRPI-4971]_the_betslip_should_display_the_multiples_bet_builder", async () => {
        expect(
          (
            await browser.compareScreen(
              `${MODULE_NAME}_[PRPI-4971]_the_betslip_should_display_the_multiples_bet_builder`,
            )
          ).misMatchPercentage,
        ).toBe(0);
      });
    });
  });
});
