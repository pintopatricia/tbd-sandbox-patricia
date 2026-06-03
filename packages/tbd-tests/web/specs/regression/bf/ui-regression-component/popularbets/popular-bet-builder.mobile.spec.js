const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const {
  EventPagePO,
  BetBuildersCardPO,
  BetLegsPO,
  HeaderPO,
  BetSelectionDetailsPO,
  CardPO,
  BetslipDrawerPO,
  SportsbookBetButtonPO,
} = require("../../../../../page-objects");
const PopularBetBuilderPO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.po");
const { getSportsLayout, getEventLayout, getMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
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
const secondBetSelectionPO = new BetSelectionDetailsPO(betLegsPO.selections[1]);
const thirdBetSelectionPO = new BetSelectionDetailsPO(betLegsPO.selections[2]);
const fourthBetSelectionPO = new BetSelectionDetailsPO(betLegsPO.selections[3]);
const fifthBetSelectionPO = new BetSelectionDetailsPO(betLegsPO.selections[4]);
const headerPO = new HeaderPO();
const cardPO = new CardPO();
const betslipDrawerPO = new BetslipDrawerPO();
const eventPagePO = new EventPagePO();

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

const BFF_EVENT_PAGE_MOCK = {
  url: `football/uefa-champions-league/chelsea-v-real-madrid/e-${EVENT_ID}`,
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${FIRST_MARKET_ID}`,
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  selectionId: 48044,
                  runnerURN: `ppb:excRunner:${FIRST_MARKET_ID}/48044/0`,
                  name: "Wolves",
                },
                {
                  selectionId: 48351,
                  runnerURN: `ppb:excRunner:${FIRST_MARKET_ID}/48351/0`,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:excRunner:${FIRST_MARKET_ID}/48044/0` },
              { runnerURN: `ppb:excRunner:${FIRST_MARKET_ID}/48351/0` },
            ],
          },
        },
        viewLinks: [
          {
            viewUrn: `ppb:tbd:view:market:${FIRST_MARKET_ID}`,
            viewUrl: `/soccer/english-premier-league/chelsea-v-tottenham/match-odds/m-${FIRST_MARKET_ID}`,
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        __typename: "MarketCard",
      },
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

describe("PopularBetBuilder", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(popularBetBuilderPO.element);
    await browser.waitUntilEquals(sportsbookBetButtonPO.odd, "Add to Betslip at 81.81");
  });

  it("[PRPI-3630] the popular bet builder should be displayed", async () => {
    expect(await popularBetBuilderPO.element.isDisplayed()).toBe(true);
  });

  describe("When the user clicks on the bet button", () => {
    beforeAll(async () => {
      await sportsbookBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placeBetBuildersCardPO.betBuilders[0]);
    });

    it("[PRPI-3977] the information that the popular was added to the betslip should be displayed", async () => {
      expect(await placeBetBuildersCardPO.betBuilders.length).toBe(1);
    });

    it("[PRPI-3978] the first selection should be the one displayed from popular bet builder", async () => {
      expect(await firstBetSelectionPO.title.getText()).toEqual("Sgt Carneiro");
      expect(await firstBetSelectionPO.subtitle.getText()).toEqual("Anytime Goalscorer - Popular v Bet Builder");
    });

    it("[PRPI-3979] the second selection should be the one displayed from popular bet builder", async () => {
      expect(await secondBetSelectionPO.title.getText()).toEqual("Alberto Silva");
      expect(await secondBetSelectionPO.subtitle.getText()).toEqual(
        "Missed Shots Over/Under 100.5 - Popular v Bet Builder",
      );
    });

    it("[PRPI-3980] the third selection should be the one displayed from popular bet builder", async () => {
      expect(await thirdBetSelectionPO.title.getText()).toEqual("Third Runner");
      expect(await thirdBetSelectionPO.subtitle.getText()).toEqual("Third Market - Popular v Bet Builder");
    });

    it("[PRPI-3981] the fourth selection should be the one displayed from popular bet builder", async () => {
      expect(await fourthBetSelectionPO.title.getText()).toEqual("Fourth Runner");
      expect(await fourthBetSelectionPO.subtitle.getText()).toEqual("Fourth Market - Popular v Bet Builder");
    });

    it("[PRPI-3982] the fifth selection should be the one displayed from popular bet builder", async () => {
      expect(await fifthBetSelectionPO.title.getText()).toEqual("Fifth Runner");
      expect(await fifthBetSelectionPO.subtitle.getText()).toEqual("Fifth Market - Popular v Bet Builder");
    });

    describe("and then clicks on it again", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await sportsbookBetButtonPO.element.click();
        await browser.waitUntilEquals(sportsbookBetButtonPO.odd, "Add to Betslip at 81.81");
      });

      it("[PRPI-3813]the bets should be removed from the betslip", async () => {
        expect(await betslipDrawerPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-8328]the bet button should not have the selected state", async () => {
        expect(await browser.containsClass(sportsbookBetButtonPO.element, SportsbookBetButtonPO.states.selected)).toBe(
          false,
        );
      });
    });
  });

  describe("when the user selects American Odds as preferred format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn, { sportsbookOddsDisplay: "AMERICAN" }));
      await browser.refresh();
      await browser.waitUntilDisplayed(popularBetBuilderPO.element);
      await browser.waitUntilEquals(sportsbookBetButtonPO.odd, "Add to Betslip at +8081");
    });

    it("[PRPI-3629] the odds should be displayed in american format", async () => {
      expect(await sportsbookBetButtonPO.odd.getText()).toBe("Add to Betslip at +8081");
    });
  });

  describe("when the user clicks on the scoreboard component", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
      await popularBetBuilderPO.scoreboardContainer.click();
      await browser.waitUntilDisplayed(await headerPO.backButton);
      await browser.waitUntilEquals(cardPO.title, "Match Odds");
    });

    it("[PRPI-6276] The back button should be displayed", async () => {
      expect(await headerPO.backButtonIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-6277] It should be redirected to an Event View", async () => {
      expect(await browser.getUrl()).toContain(`football/uefa-champions-league/chelsea-v-real-madrid/e-${EVENT_ID}`);
    });

    it("[PRPI-6278] It should be in the event page", async () => {
      expect(await eventPagePO.element.isDisplayed()).toBe(true);
    });
  });
});
