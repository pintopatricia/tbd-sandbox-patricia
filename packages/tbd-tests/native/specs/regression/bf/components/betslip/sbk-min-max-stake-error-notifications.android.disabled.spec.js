const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { swipeUpElement, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  MultiplesCardSO,
  SinglesCardSO,
  SingleSO,
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  BetDetailsSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  AlertSO,
} = require("../../../../../screen-objects");

const mockService = new MockService(driver.capabilities.deviceName);
const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const thirdCardSO = new CardSO(genericScreenSO.cards[2]);
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const secondSportsbookMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
const thirdSportsbookMarketSO = new InlineSportsbookMarketSO(thirdCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const secondRunnerSO = new SportsbookBetButtonSO(secondSportsbookMarketSO.sbkBetButtons[0]);
const thirdRunnerSO = new SportsbookBetButtonSO(thirdSportsbookMarketSO.sbkBetButtons[0]);

const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.element);

const secondSinglesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const secondSingleSO = new SingleSO(secondSinglesCardSO.singles[1]);
const secondBetDetailsSO = new BetDetailsSO(secondSingleSO.element);

const thirdSinglesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const thirdSingleSO = new SingleSO(thirdSinglesCardSO.singles[2]);
const thirdBetDetailsSO = new BetDetailsSO(thirdSingleSO.element);

const placeMultipleControlsSO = new BetControlsSO(sportsbookPlacePanelSO.element);
const multipleStakeInputFieldSO = new CurrencyNumberInputFieldSO(placeMultipleControlsSO.currencyInput);
const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);
const singlePlacePanelCardItemSO = new SingleSO(sportsbookPlacePanelSO.element);
const singlePlacePanelCardItemControlsSO = new BetControlsSO(singlePlacePanelCardItemSO.controls);
const sportsbookSinglePlaceSizeInputFieldSO = new CurrencyNumberInputFieldSO(
  singlePlacePanelCardItemControlsSO.currencyInput,
);
const placePanelAlertSO = new AlertSO();

const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";
const THIRD_MARKET_ID = "924.3";

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;
const SECOND_EVENT_ID = 29359891;
const THIRD_EVENT_ID = 29359892;
const FOURTH_EVENT_ID = 29359893;

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 5 } },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48041,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 2 } },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48052,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 5 } },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
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
                  urn: `ppb:event:${EVENT_ID}`,
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
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Sporting",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48044`,
                      },
                    ],
                  },
                },
              },
            },
          ],
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
                    name: "2 Sporting",
                  },
                  away: {
                    name: "2 Man Utd",
                  },
                },
                sportevent: {
                  name: "2 Sporting v 2 Man Utd",
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
                          name: "2 Sporting v Man Utd",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48041`,
                          selectionId: 48041,
                          name: "2 Sporting",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48041`,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Third Card",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${THIRD_EVENT_ID}`,
                  home: {
                    name: "3 Sporting",
                  },
                  away: {
                    name: "3 Man Utd",
                  },
                },
                sportevent: {
                  name: "3 Sporting v 3 Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${THIRD_EVENT_ID}`,
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
                      urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                      noLiveData: true,
                      name: "First Goal Scorer",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "3 Sporting v Man Utd",
                          urn: `ppb:event:${THIRD_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48052`,
                          selectionId: 48052,
                          name: "3 Sporting",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48052`,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Fourth Card",
        urn: "ppb:tbd:card:group:topEventsInSport:4",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FOURTH_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FOURTH_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${FOURTH_EVENT_ID}`,
                  home: {
                    name: "4 Sporting",
                  },
                  away: {
                    name: "4 Man Utd",
                  },
                },
                sportevent: {
                  name: "4 Sporting v 4 Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${FOURTH_EVENT_ID}`,
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
                      urn: `ppb:sbkMarket:${FOURTH_EVENT_ID}`,
                      noLiveData: true,
                      name: "First Goal Scorer",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "4 Sporting v Man Utd",
                          urn: `ppb:event:${FOURTH_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FOURTH_EVENT_ID}/48052`,
                          selectionId: 48052,
                          name: "4 Sporting",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FOURTH_EVENT_ID}/48052`,
                      },
                    ],
                  },
                },
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:4",
      },
    },
  ],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 48044,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: 48044,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: 48041,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 48041,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: THIRD_MARKET_ID,
          selectionId: 48052,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: THIRD_MARKET_ID,
    selectionId: 48052,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
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
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      canPlaceEachwayBet: true,
      betMinStakeIncrement: 0.01,
      numLines: 3,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.01,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.01 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const TREBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      betType: "TREBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      canPlaceEachwayBet: true,
      betMinStakeIncrement: 0.01,
      numLines: 3,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.01,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.01 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const PLACE_RESPONSE_FAIL_MOCK = {
  result: [],
  respCode: "BET_PLACEMENT_FAILURE",
};

describe("Min stake, max stake and error message notifications", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when the user adds one selection to betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Sportsbook single place panel element was not displayed",
      );
    });

    describe("and when the user adds a second selection", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(betslipDrawerSO.header);
        await betslipDrawerSO.header.click();
        await browser.waitUntilDisplayed(minimizedSO.element, "Minimized Betslip was not displayed");
        await swipeUpElement(firstRunnerSO.element, 500);
        await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
        await browser.waitUntilDisplayed(secondRunnerSO.element, "Second runner bet button was not displayed");
        await secondRunnerSO.element.click();
        await browser.waitUntilEquals(minimizedSO.counter, "2");
      });

      describe("and user adds a third selection", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
          await swipeUpElement(secondRunnerSO.element, 500);
          await browser.waitUntilDisplayed(thirdRunnerSO.element, "Third runner bet button was not displayed");
          await thirdRunnerSO.element.click();
          await browser.waitUntilEquals(minimizedSO.counter, "3");
        });

        describe("and when user place a multiple bet and the request has an error", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getPlaceBet(PLACE_RESPONSE_FAIL_MOCK));
            await browser.waitUntilClickableNative(minimizedSO.element);
            await minimizedSO.element.click();
            await browser.waitUntilDisplayed(multiplesCardSO.element, "Multiples Card was not displayed");
            await multipleStakeInputFieldSO.setValue("2");
            await browser.waitUntilEquals(multipleStakeInputFieldSO.numberField, "2");
            await hideKeyboard();
            await browser.waitUntilDisplayed(placeButtonSO.element, "The place panel is not displayed");
            await placeButtonSO.element.click();
            await browser.waitUntilEquals(placePanelAlertSO.message, "Your bets could not be placed.");
          });

          it("[PRPI-3431] the error message 'Your bets could not be placed' should be displayed", async () => {
            expect(await placePanelAlertSO.element.isDisplayed()).toEqual(true);
            expect(await placePanelAlertSO.message.getText()).toBe("Your bets could not be placed.");
          });

          describe("and when the user removes the third and the second selections", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
              await thirdBetDetailsSO.action.click();
              await browser.waitUntilNotInDOM(thirdBetDetailsSO.element);
              await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_SINGLE_MOCK));
              await secondBetDetailsSO.action.click();
              await browser.waitUntilDisplayed(
                sportsbookPlacePanelSO.element,
                "Sportsbook single place panel element was not displayed",
              );
            });

            describe("and when the user insert a $0.09 stake", () => {
              beforeAll(async () => {
                await sportsbookSinglePlaceSizeInputFieldSO.numberField.setValue(0.09);
                await browser.waitUntilEquals(sportsbookSinglePlaceSizeInputFieldSO.numberField, "0.09");
                await hideKeyboard();
                await browser.waitUntilEquals(sportsbookSinglePlaceSizeInputFieldSO.numberField, "0.12");
              });

              it("[PRPI-3431] the size value should be corrected to 0.12", async () => {
                expect(await sportsbookSinglePlaceSizeInputFieldSO.numberField.getValue()).toBe("0.12");
              });

              describe("And when the user inserts a €1001 stake", () => {
                beforeAll(async () => {
                  await sportsbookSinglePlaceSizeInputFieldSO.numberField.setValue(1001);
                  await browser.waitUntilEquals(sportsbookSinglePlaceSizeInputFieldSO.numberField, "1001");
                  await hideKeyboard();
                  await browser.waitUntilEquals(sportsbookSinglePlaceSizeInputFieldSO.numberField, "1000");
                });

                it("[PRPI-3431] the size value should be corrected to 1000", async () => {
                  expect(await sportsbookSinglePlaceSizeInputFieldSO.numberField.getValue()).toBe("1000");
                });
              });
            });
          });
        });
      });
    });
  });
});
