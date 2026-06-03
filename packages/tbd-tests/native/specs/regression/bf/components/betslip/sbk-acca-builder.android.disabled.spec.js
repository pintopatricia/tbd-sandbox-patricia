const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");
const { swipeUp } = require("../../../../../helpers/gestures");

const {
  GenericScreenSO,
  SportsbookPlacePanelSO,
  BetslipMinimizedSO,
  CardSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  BetDetailsSO,
  CounterSO,
  StyledSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 1;
const SECOND_EVENT_ID = 2;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 6.5 },
            },
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 4,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 6.5 },
            },
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 5,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 6,
          noOdds: true,
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: `ppb:tbd:card:group:topEventsInSport:1`,
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${FIRST_EVENT_ID}`,
                  home: {
                    name: "Sporting",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Sporting v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${FIRST_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:${FIRST_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                          selectionId: 1,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2`,
                          selectionId: 2,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/3`,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Second Card",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${SECOND_EVENT_ID}`,
                  home: {
                    name: "Porto",
                  },
                  away: {
                    name: "West Ham",
                  },
                },
                sportevent: {
                  name: "Porto v West Ham",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${SECOND_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Porto v West Ham",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                          selectionId: 4,
                          name: "Porto",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/5`,
                          selectionId: 5,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/6`,
                          selectionId: 6,
                          name: "West Ham",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/5`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/6`,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 6.5,
  winAverageOdds: 6.5,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
    decimalDisplayOdds: {
      decimalOdds: 6.5,
    },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
    decimalDisplayOdds: {
      decimalOdds: 6.5,
    },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: 4,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 6.5,
  winAverageOdds: 6.5,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
    decimalDisplayOdds: {
      decimalOdds: 6.5,
    },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
    decimalDisplayOdds: {
      decimalOdds: 6.5,
    },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: 2,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 2,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 461.5,
      winAverageOdds: 461.5,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 461.5,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 461.5 },
        },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const DOUBLE_SEVERAL_LINES_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 461.5,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 461.5 },
        },
      },
      numLines: 3,
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

describe("Betslip - SBK Acca Bet Builder", () => {
  beforeAll(async () => {
    const genericScreenSO = new GenericScreenSO();

    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when the user taps on a given bet button", () => {
    const loadedGenericScreenSO = new GenericScreenSO();
    const firstCardSO = new CardSO(loadedGenericScreenSO.cards[0]);
    const secondCardSO = new CardSO(loadedGenericScreenSO.cards[1]);
    const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
    const secondSportsbookMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
    const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
    const secondRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[1]);
    const thirdRunnerSO = new SportsbookBetButtonSO(secondSportsbookMarketSO.sbkBetButtons[0]);

    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.element, "Element not visible");
      await firstRunnerSO.element.click();

      const sportsbookPlaceSO = new SportsbookPlacePanelSO();

      await browser.waitUntilDisplayed(sportsbookPlaceSO.element, "Waiting for Sportsbook single place panel element");
    });

    it("[PRPI-3303] should show Betslip with that selection", async () => {
      const betslipDrawerSO = new BetslipDrawerSO();
      const betDetailsSO = new BetDetailsSO();

      expect(await betslipDrawerSO.header.isDisplayed()).toBe(true);
      expect(await betDetailsSO.title.getText()).toBe("Sporting");
    });

    describe("when the user taps again the same button", () => {
      beforeAll(async () => {
        const betslipDrawerSO = new BetslipDrawerSO();

        await browser.waitUntilClickableNative(betslipDrawerSO.header);
        await betslipDrawerSO.header.click();
        await browser.waitUntilDisplayed(firstRunnerSO.element);
        await firstRunnerSO.element.click();
        await browser.waitUntilNotDisplayed(betslipDrawerSO.header);
      });

      it("[PRPI-3304] should close Betslip", async () => {
        const betslipDrawerSO = new BetslipDrawerSO();

        expect(await betslipDrawerSO.header.isExisting()).toBe(false);
      });

      describe("when the user adds two non combinable selections", () => {
        beforeAll(async () => {
          await swipeUp(0.5);
          await browser.waitUntilDisplayed(firstRunnerSO.element);
          await firstRunnerSO.element.click();
          await browser.waitUntilDisplayed(secondRunnerSO.element);
          await secondRunnerSO.element.click();

          const betslipDrawerSO = new BetslipDrawerSO();

          await browser.waitUntilDisplayed(betslipDrawerSO.header);
        });

        it("[PRPI-3305] should collapse Betslip automatically", async () => {
          const betslipDrawerSO = new BetslipDrawerSO();
          const betDetailsSO = new BetDetailsSO();

          expect(await betslipDrawerSO.header.isDisplayed()).toBe(true);
          expect(await betDetailsSO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-3306] should show text 'Betslip' and counter with 2 selections", async () => {
          const betslipMinimizedSO = new BetslipMinimizedSO();
          const counterSO = new CounterSO();

          expect(await betslipMinimizedSO.strongTitle.getText()).toBe("Betslip");
          expect(await counterSO.value.getText()).toBe("2");
        });

        describe("when the user taps again on the second selection", () => {
          beforeAll(async () => {
            await browser.waitUntilDisplayed(secondRunnerSO.element);
            await secondRunnerSO.element.click();

            const betDetailsSO = new BetDetailsSO();

            await browser.waitUntilDisplayed(betDetailsSO.element);
          });

          it("[PRPI-3307] should expand Betslip and show first selection info", async () => {
            const betDetailsSO = new BetDetailsSO();

            expect(await betDetailsSO.title.getText()).toBe("Sporting");
            expect(await betDetailsSO.subtitle.getText()).toBe("Match Odds - Sporting v Man Utd");
          });

          describe("when user collapses the betslip", () => {
            beforeAll(async () => {
              const betslipDrawerSO = new BetslipDrawerSO();
              const betslipMinimizedSO = new BetslipMinimizedSO();

              await browser.waitUntilClickableNative(betslipDrawerSO.header);
              await betslipDrawerSO.header.click();
              await browser.waitUntilEquals(betslipMinimizedSO.title, "$10.00 Single @ 1.1 returns $11.00");
            });

            it("[PRPI-3308] should show a bet builder message '$10.00 Single @ 1.1 returns $11.00'", async () => {
              const betslipMinimizedSO = new BetslipMinimizedSO();

              expect(await betslipMinimizedSO.strongTitle.getText()).toBe("$10.00 Single @ 1.1 returns $11.00");
            });

            describe("when the user adds a combinable selection", () => {
              beforeAll(async () => {
                await swipeUp(0.5);
                await browser.waitUntilDisplayed(thirdRunnerSO.element);
                await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
                await thirdRunnerSO.element.click();

                const betslipMinimizedSO = new BetslipMinimizedSO();
                const accaBuilderSO = new StyledSO(betslipMinimizedSO.element);

                await browser.waitUntilEquals(accaBuilderSO.title, "$10.00 Double @ 461.5 returns $4,615.00");
              });

              it("[PRPI-3308] should collapse Betslip and show acca bet builder info", async () => {
                const betslipMinimizedSO = new BetslipMinimizedSO();
                const accaBuilderSO = new StyledSO(betslipMinimizedSO.element);

                expect(await accaBuilderSO.title.getText()).toBe("$10.00 Double @ 461.5 returns $4,615.00");
              });

              describe("when the user adds another selection (from one of the previous markets)", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_SEVERAL_LINES_MOCK));
                  await browser.waitUntilDisplayed(secondRunnerSO.element);
                  await secondRunnerSO.element.click();

                  const betslipMinimizedSO = new BetslipMinimizedSO();

                  await browser.waitUntilEquals(betslipMinimizedSO.strongTitle, "Betslip");
                });

                it("[PRPI-3308] should show text 'Betslip' and a counter with 3 selections", async () => {
                  const betslipMinimizedSO = new BetslipMinimizedSO();
                  const counterSO = new CounterSO();

                  expect(await betslipMinimizedSO.strongTitle.getText()).toBe("Betslip");
                  expect(await counterSO.value.getText()).toBe("3");
                });
              });
            });
          });
        });
      });
    });
  });
});
