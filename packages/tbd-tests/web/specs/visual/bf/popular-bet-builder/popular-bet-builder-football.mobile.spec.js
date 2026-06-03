const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { BetBuildersCardPO, BetslipDrawerPO, SportsbookBetButtonPO } = require("../../../../page-objects");
const PopularBetBuilderPO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.po");
const { getSportsLayout, getMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();
const popularBetBuilderPO = new PopularBetBuilderPO();
const placeBetBuildersCardPO = new BetBuildersCardPO();
const sportsbookBetButtonPO = new SportsbookBetButtonPO(popularBetBuilderPO.popularBetBuilderBetButton);
const betslipDrawerPO = new BetslipDrawerPO();

const MODULE_NAME = "popular_bet_builder";
const EVENT_TYPE_ID = 1;
const EVENT_ID = 12345;
const COMPETITION_ID = 123;
const FIRST_MARKET_ID = 924.1;
const SECOND_MARKET_ID = 924.2;
const THIRD_MARKET_ID = 924.3;
const FOURTH_MARKET_ID = 924.4;
const FIFTH_MARKET_ID = 924.5;

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
                __typename: "PopularBetBuilderCard",
                urn: "ppb:tbd:card:popularbetbuilder:bo-1|1|0|0",
                id: "bo-1|1|0|0",
                fixture: {
                  __typename: "FootballFixture",
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Popular",
                  },
                  away: {
                    name: "Bet Builder",
                  },
                },
                sportevent: {
                  name: "Popular vs Bet Builder",
                  urn: `ppb:event:${EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: `ppb:competition:${COMPETITION_ID}`,
                    name: "The Competition",
                  },
                },
                viewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: `football/uefa-champions-league/chelsea-v-real-madrid/e-${EVENT_ID}`,
                },
                popularbettingopportunity: {
                  urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
                  count: 81,
                  type: "POPULAR",
                  selections: [
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                        name: "Anytime Goalscorer",
                        marketType: "TO_SCORE",
                        isSuperSub: false,
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
                            name: "Sgt Carneiro",
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
                        name: "Missed Shots Over/Under 100.5",
                        marketType: "OVER_UNDER_1005",
                        isSuperSub: false,
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
                            name: "Alberto Silva",
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
                        name: "Third Market",
                        marketType: "MATCH_ODDS",
                        isSuperSub: true,
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
                            name: "Third Runner",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
                        selectionId: 3,
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FOURTH_MARKET_ID}`,
                        name: "Fourth Market with name too long",
                        marketType: "MATCH_ODDS_90",
                        isSuperSub: false,
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/4`,
                            selectionId: 4,
                            name: "Fourth Runner",
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
                        urn: `ppb:sbkMarket:${FIFTH_MARKET_ID}`,
                        name: "Fifth Market with name even longer than the fourth one",
                        marketType: "FULL_TIME_RESULT_-_2_UP",
                        isSuperSub: false,
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${FIFTH_MARKET_ID}/5`,
                            selectionId: 5,
                            name: "Fifth Runner",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${FIFTH_MARKET_ID}/5`,
                        selectionId: 5,
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
                __typename: "PopularBetBuilderCard",
                urn: "ppb:tbd:card:popularbetbuilder:bo-1|1|0|0",
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
    trueOdds: { decimalOdds: { decimalOdds: 2.0 } },
    decimalDisplayOdds: { decimalOdds: 2.0 },
  },
};

const THIRD_RUNNER_SIB = {
  runner: { marketId: THIRD_MARKET_ID, selectionId: 3 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 3.0 } },
    decimalDisplayOdds: { decimalOdds: 3.0 },
  },
};

const FOURTH_RUNNER_SIB = {
  runner: { marketId: FOURTH_MARKET_ID, selectionId: 4 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 4.0 } },
    decimalDisplayOdds: { decimalOdds: 4.0 },
  },
};

const FIFTH_RUNNER_SIB = {
  runner: { marketId: FIFTH_MARKET_ID, selectionId: 5 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 5.0 } },
    decimalDisplayOdds: { decimalOdds: 5.0 },
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

    averageOdds: 2.0,
    winAverageOdds: 2.0,
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

    averageOdds: 3.0,
    winAverageOdds: 3.0,
    winAvgOdds: {
      trueOdds: THIRD_RUNNER_SIB.odds.trueOdds,
      decimalDisplayOdds: THIRD_RUNNER_SIB.odds.decimalDisplayOdds,
    },
  },
  {
    legCombinations: [
      {
        runners: [FOURTH_RUNNER_SIB.runner],
        legType: "SIMPLE_SELECTION",
      },
    ],

    averageOdds: 4.0,
    winAverageOdds: 4.0,
    winAvgOdds: {
      trueOdds: FOURTH_RUNNER_SIB.odds.trueOdds,
      decimalDisplayOdds: FOURTH_RUNNER_SIB.odds.decimalDisplayOdds,
    },
  },
  {
    legCombinations: [
      {
        runners: [FIFTH_RUNNER_SIB.runner],
        legType: "SIMPLE_SELECTION",
      },
    ],

    averageOdds: 5.0,
    winAverageOdds: 5.0,
    winAvgOdds: {
      trueOdds: FIFTH_RUNNER_SIB.odds.trueOdds,
      decimalDisplayOdds: FIFTH_RUNNER_SIB.odds.decimalDisplayOdds,
    },
  },
];

const POPULAR_BET_BUILDER_COMBINATION = {
  betType: "FOURFOLD",
  features: ["SGM"],
  averageOdds: 81.81,
  winAverageOdds: 81.81,
  combinationGroup: 0,
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
    {
      runners: [FIFTH_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 81.81 } },
    decimalDisplayOdds: { decimalOdds: 81.81 },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 81.81 } },
  },
};

const SIB_MOCK = {
  betCombinations: [...SINGLE_BET_COMBINATION, POPULAR_BET_BUILDER_COMBINATION],
  runnerOdds: [FIRST_RUNNER_SIB, SECOND_RUNNER_SIB, THIRD_RUNNER_SIB, FOURTH_RUNNER_SIB, FIFTH_RUNNER_SIB],
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
            decimalDisplayOdds: { decimalOdds: 2.0 },
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
            decimalDisplayOdds: { decimalOdds: 3.0 },
          },
        },
      ],
    },
    {
      marketId: `${FOURTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 4,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.0 },
          },
        },
      ],
    },
    {
      marketId: `${FIFTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 5,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.0 },
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
    { urn: `ppb:sbkMarket:${FIFTH_MARKET_ID}` },
  ],
};

async function setupTestEnvironment(throttleOptions) {
  const indexHTML = await getIndexHTML(BFF_VIEW_MOCK.urn, throttleOptions);
  await mockService.mockHttpRequest(indexHTML);
  await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
  await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
  await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
  await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
  await mockService.mockFonts(getMockFonts());

  await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
}

describe("PopularBetBuilder", () => {
  describe("Football Bet Builder", () => {
    beforeAll(async () => {
      await setupTestEnvironment();

      await browser.waitUntilEquals(popularBetBuilderPO.popularBetBuilderBetButton, "Add to Betslip at 81.81");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1504]_should_render_popular_bet_builder_card`);
    });

    it("[PRPI-1504]_should_render_popular_bet_builder_card", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1504]_should_render_popular_bet_builder_card`)).toBe(0);
    });

    describe("When the user clicks on the bet button", () => {
      beforeAll(async () => {
        await sportsbookBetButtonPO.element.click();
        await browser.tickFakeClock();
        await browser.waitUntilDisplayed(placeBetBuildersCardPO.betBuilders[0]);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4792]_the_betslip_should_display_the_popular_badge`);
      });

      it("[PRPI-4792]_the_betslip_should_display_the_popular_badge", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-4792]_the_betslip_should_display_the_popular_badge`),
        ).toBe(0);
      });

      describe("and then collapses betslip", () => {
        beforeAll(async () => {
          await betslipDrawerPO.header.click();
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-4793]_the_price_button_should_be_displayed_on_a_selected_state`,
          );
        });

        it("[PRPI-4793]_the_price_button_should_be_displayed_on_a_selected_state", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-4793]_the_price_button_should_be_displayed_on_a_selected_state`,
            ),
          ).toBe(0);
        });
      });
    });
  });

  describe("Football Bet Builder when the throttle POPULAR_BET_BUILDER_SELECTION_TYPE_ICON is active", () => {
    beforeAll(async () => {
      await setupTestEnvironment({
        POPULAR_BET_BUILDER_SELECTION_TYPE_ICON: { isActive: true },
      });

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1507]_should_render_popular_bet_builder_card_with_selection_type_icon`,
      );
    });

    it("[PRPI-1507]_should_render_popular_bet_builder_card_with_selection_type_icon", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1507]_should_render_popular_bet_builder_card_with_selection_type_icon`,
        ),
      ).toBe(0);
    });
  });
});
