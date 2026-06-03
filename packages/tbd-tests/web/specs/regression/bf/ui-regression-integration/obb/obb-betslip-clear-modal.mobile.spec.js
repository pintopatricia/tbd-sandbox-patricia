const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const {
  MinimizedPO,
  BetBuildersCardPO,
  BetLegsPO,
  ObbPlacePO,
  BetSelectionDetailsPO,
  BetslipDrawerPO,
  SportsbookBetButtonPO,
  PrimaryButtonPO,
  ConfirmDrawerPO,
} = require("../../../../../page-objects");
const PopularBetBuilderPO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.po");
const { getSportsLayout, getMarkets, getObbQuotes } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const popularBetBuilderPO = new PopularBetBuilderPO();
const placeBetBuildersCardPO = new BetBuildersCardPO();
const betLegsPO = new BetLegsPO(placeBetBuildersCardPO.element);
const sportsbookBetButtonPO = new SportsbookBetButtonPO(popularBetBuilderPO.popularBetBuilderBetButton);
const firstBetSelectionPO = new BetSelectionDetailsPO(betLegsPO.selections[0]);

const placePanelPO = new ObbPlacePO();
const placeButtonPO = new PrimaryButtonPO(placePanelPO.placeBtn);
const betslipDrawerPO = new BetslipDrawerPO();
const minimizedPO = new MinimizedPO();
const confirmDrawerPO = new ConfirmDrawerPO();

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
                  viewUrl: `football/uefa-champions-league/chelsea-v-real-madrid/e-${EVENT_ID}`,
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

const legsQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
      __typename: "EventId",
    },
    prices: [
      {
        id: "p6r7cj38lb86w8h",
        price: {
          decimal: 5,
          fractional: {
            numerator: 5,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
    ],
  },
};

describe("when I have an OBB potential bet in local storage", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
    await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(popularBetBuilderPO.element);

    const bettingState = {
      potentialBets: {
        "SINGLE:[p6r7cj38lb86w8h]": {
          id: "SINGLE:[p6r7cj38lb86w8h]",
          betType: "SINGLE",
          legs: ["p6r7cj38lb86w8h"],
          stake: null,
          potentialReturns: null,
          quote: {
            price: {
              fractional: { numerator: 21, denominator: 10 },
              decimal: 2.3,
            },
          },
          maxStake: null,
          minStake: null,
          maxPayout: null,
          minStakeIncrement: null,
        },
      },
      legs: {
        p6r7cj38lb86w8h: {
          id: "p6r7cj38lb86w8h",
          templateId: "playerVsPlayer",
          event: {
            urn: `ppb:event:${EVENT_ID}`,
            name: "North Macedonia v Latvia",
            eventId: EVENT_ID,
          },
          quote: {
            price: {
              decimal: 2.3,
              fractional: { numerator: 21, denominator: 10 },
            },
          },
          metadata: {
            legTypeDescription: "PVP",
            participantsDescription: "David Babunski",
            outcomeDescription: "To Score More Goals than Bukayo Saka During Regular Time",
            legDescription: "David Babunski To score more goals than Bukayo Saka during regular time",
          },
          params: {
            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
            timePeriodId: "MATCH",
            participantIdA: "102114",
            participantIdB: "86724",
          },
        },
      },
      totalStake: null,
      totalPotentialReturns: null,
      maxPayoutLimits: { warning: 250000, error: 1000000 },
      validations: { betslip: [], potentialBets: {} },
      failures: { betslip: null, potentialBets: {}, legs: {} },
    };

    // adding obbBettingState with a valid potential bet to local storage
    await browser.execute(
      (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      "obbBettingState",
      bettingState,
    );

    await browser.refresh();
    await browser.waitUntilDisplayed(placePanelPO.element);
  });

  it("[PRPI-6931] the betslip should be displayed when I open the page (persistency)", async () => {
    expect(await placeButtonPO.element.isDisplayed()).toBe(true);
    expect(await placePanelPO.element.isDisplayed()).toBe(true);
    expect(await betslipDrawerPO.header.getText()).toBe("Betslip");
  });

  describe("and when I try to add a popular bet builder to the betslip", () => {
    beforeAll(async () => {
      await betslipDrawerPO.header.click();
      await browser.waitUntilEquals(sportsbookBetButtonPO.odd, "Add to Betslip at 81.81");
      await sportsbookBetButtonPO.element.click();
    });

    it("[PRPI-6932] I should be prompted the clear betslip modal", async () => {
      expect(await confirmDrawerPO.title.getText()).toBe("Clear Betslip?");
      expect(await confirmDrawerPO.subtitle.getText()).toBe("This bet cannot be combined with Match Ups.");
      expect(await confirmDrawerPO.refuseButton.getText()).toBe("Keep Match Ups Betslip");
      expect(await confirmDrawerPO.acceptButton.getText()).toBe("Clear Betslip");
    });

    describe("and whn I press 'Keep Match Ups Betslip'", () => {
      beforeAll(async () => {
        await confirmDrawerPO.refuseButton.waitForClickable();
        await confirmDrawerPO.refuseButton.click();
      });

      it("[PRPI-6933] the clear betslip modal should be dismissed", async () => {
        expect(await confirmDrawerPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-6934] the betslip should still be populated", async () => {
        expect(await minimizedPO.counter.getText()).toBe("1");
      });

      describe("and when I add the bet again and accept", () => {
        beforeAll(async () => {
          await sportsbookBetButtonPO.element.click();
          await confirmDrawerPO.acceptButton.waitForClickable();
          await confirmDrawerPO.acceptButton.click();
        });

        it("[PRPI-6935] the betslip should clear the obb selection and the bet builder should be added", async () => {
          expect(await betslipDrawerPO.header.getText()).toBe("Betslip");
          expect(await firstBetSelectionPO.title.getText()).toEqual("Sgt Carneiro");
          expect(await firstBetSelectionPO.subtitle.getText()).toEqual("Anytime Goalscorer - Popular v Bet Builder");
        });
      });
    });
  });
});
