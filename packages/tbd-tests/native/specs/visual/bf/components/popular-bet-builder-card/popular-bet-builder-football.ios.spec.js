const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const PopularBetBuilderSO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.so");
const { getGenericLayout, getMarkets, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const { BetBuildersCardSO, SportsbookBetButtonSO, BetslipDrawerSO } = require("../../../../../screen-objects");

const mockService = new MockService();
const popularBetBuilderSO = new PopularBetBuilderSO();
const betBuildersCardSO = new BetBuildersCardSO();
const betslipDrawerSO = new BetslipDrawerSO();
const sportsbookBetButtonSO = new SportsbookBetButtonSO(popularBetBuilderSO.popularBetBuilderBetButton);

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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "Popular Bets",
        full: {
          edges: [
            {
              node: {
                __typename: "PopularBetBuilderCard",
                urn: "ppb:tbd:card:popularbetbuilder:bo-1|1|0|0",
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
                viewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: `/event/${EVENT_ID}`,
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
                popularbettingopportunity: {
                  urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
                  count: 81,
                  selections: [
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                        name: "Anytime Goalscorer",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
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
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
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
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
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
                        name: "Fourth Market",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
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
                        name: "Fifth Market",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
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
  betCombinations: [POPULAR_BET_BUILDER_COMBINATION],
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

const CARD_NAME = "popular-bet-builder-card";

describe("PopularBetBuilder", () => {
  describe("Football Bet Builder", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
      await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(`football/s-${EVENT_TYPE_ID}`);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilEquals(sportsbookBetButtonSO.odd, "Add to Betslip at 81.81");
      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4928]_should_render_popular_card`);
    });

    it("[PRPI-4928]_should_render_popular_card", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4928]_should_render_popular_card`)).misMatchPercentage,
      ).toEqual(0);
    });

    describe("When the user clicks on the bet button", () => {
      beforeAll(async () => {
        await sportsbookBetButtonSO.element.click();
        await browser.waitUntilDisplayed(betBuildersCardSO.betBuilders[0]);
        await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4969]_should_open_betslip_with_all_selections`);
      });

      it("[PRPI-4969]_should_open_betslip_with_all_selections", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4969]_should_open_betslip_with_all_selections`))
            .misMatchPercentage,
        ).toEqual(0);
      });

      describe("and closes the betslip", () => {
        beforeAll(async () => {
          await betslipDrawerSO.header.click();
          await browser.waitUntilDisplayed(sportsbookBetButtonSO.odd);
          await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4970]_should_have_selected_bet_button`);
        });

        it("[PRPI-4970]_should_have_selected_bet_button", async () => {
          expect(
            (await browser.compareScreen(`${CARD_NAME}_[PRPI-4970]_should_have_selected_bet_button`))
              .misMatchPercentage,
          ).toEqual(0);
        });
      });
    });
  });
});
