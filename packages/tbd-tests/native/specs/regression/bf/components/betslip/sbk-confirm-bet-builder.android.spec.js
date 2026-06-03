const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const {
  getAppContext,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { swipeFromElementToElement } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { advanceToConfirmStep } = require("../../../../../helpers/confirm-bets");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  BetBuildersCardSO,
  BetBuilderSO,
  GenericScreenSO,
  CardSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  SelectionsBoardSO,
  PrimaryButtonSO,
  SecondaryButtonSO,
  AlertSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();

const sportsbookMinimizedBetslipSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();

const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const thirdCardSO = new CardSO(genericScreenSO.cards[2]);

const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const secondSportsbookMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
const thirdSportsbookMarketSO = new InlineSportsbookMarketSO(thirdCardSO.contentWrapper);

const firstMarketRunnerSportsbookSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const secondMarketRunnerSportsbookSO = new SportsbookBetButtonSO(secondSportsbookMarketSO.sbkBetButtons[1]);
const thirdMarketRunnerSportsbookSO = new SportsbookBetButtonSO(thirdSportsbookMarketSO.sbkBetButtons[0]);

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const betBuildersCardSO = new BetBuildersCardSO(sportsbookPlacePanelSO.collapsableSections[0]);
const firstBetBuilderSO = new BetBuilderSO(betBuildersCardSO.betBuilders[0]);
const firstSelectionBoardSO = new SelectionsBoardSO(firstBetBuilderSO.element);

const firstBetBuilderControlsSO = new BetControlsSO(firstBetBuilderSO.element);

const firstBetBuilderStakeInputFieldSO = new CurrencyNumberInputFieldSO(firstBetBuilderControlsSO.currencyInput);

const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);
const editButtonSO = new SecondaryButtonSO(sportsbookPlacePanelSO.actions[0]);
const confirmButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.actions[1]);

const placeNotification = new AlertSO(sportsbookPlacePanelSO.element);

const confirmButtonsElements = {
  placeButtonElement: placeButtonSO.element,
  editButtonElement: editButtonSO.element,
};

const APP_CONTEXT_MOCK = {
  currencyCode: "USD",
  countryCode: "GB",
  loggedIn: "true",
  products: ["sportsbook"],
  throttles: {
    BET_CONFIRMATION_STEP: { isActive: true },
  },
};

const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 1;
const SECOND_EVENT_ID = 2;
const THIRD_EVENT_ID = 3;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";
const THIRD_MARKET_ID = "924.3";

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "3",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.1 },
            },
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "4",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.21 },
            },
            decimalDisplayOdds: { decimalOdds: 2.22 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "5",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3.1 },
            },
            decimalDisplayOdds: { decimalOdds: 3.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "6",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3.2 },
            },
            decimalDisplayOdds: { decimalOdds: 3.2 },
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
        urn: `ppb:tbd:card:group:topEventsInSport:1`,
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
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
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
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
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
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
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
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
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Porto",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                          selectionId: 4,
                          name: "West Ham",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/3`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
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
        cardGroupTitle: "Third Card",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${THIRD_EVENT_ID}`,
                  home: {
                    name: "SC Ucha",
                  },
                  away: {
                    name: "Astrumil",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "SC Ucha v Astrumil",
                          urn: `ppb:event:${THIRD_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/5`,
                          selectionId: 5,
                          name: "SC Ucha",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/6`,
                          selectionId: 6,
                          name: "Astrumil",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/5`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/6`,
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
      },
    },
  ],
};

const FIRST_RUNNER = {
  marketId: "924.1",
  selectionId: 1,
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [FIRST_RUNNER],
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
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_RUNNER = {
  marketId: "924.2",
  selectionId: 4,
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [SECOND_RUNNER],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.2,
  winAverageOdds: 1.2,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.2,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.2,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_DOUBLE_SGM = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
  },
};

const FIRST_SGM_MOCK = {
  betCombinations: [FIRST_DOUBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_RUNNER = {
  marketId: "924.3",
  selectionId: 5,
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [THIRD_RUNNER],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.3,
  winAverageOdds: 1.3,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.3,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_SGM = {
  betType: "TREBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.3,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SGM_MOCK = {
  betCombinations: [TREBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SMP_MOCK_FIRST_UPDATE = {
  markets: [
    {
      selectionId: "1",
      runnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runnerStatus: "SUSPENDED",
    },
  ],
};

const DOUBLE_SGM_FAILED = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
  },
};

const MARKETS_FIRST_UPDATE_FAILURES = {
  betCombinations: [DOUBLE_SGM_FAILED, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: "1",
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

describe("Bet Builders Confirm Experience", () => {
  beforeAll(async () => {
    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await Promise.all([
      mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK)),
      mockService.mockHttpRequest(getSportsLayout(BFF_MOCK)),
      mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
      mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
      mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK)),
    ]);

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(genericScreenSO.element, "Generic screen is not visible");
  });

  describe("when one selection is added to betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstMarketRunnerSportsbookSO.element, "First bet button is not visible");
      await browser.waitUntilClickableNative(
        firstMarketRunnerSportsbookSO.element,
        "First bet button is not clickable",
      );
      await firstMarketRunnerSportsbookSO.element.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "First selection hasn't been added");
    });

    describe("and others combinable selections are added to betslip", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(betslipDrawerSO.header, "Betslip is not accessible");
        await betslipDrawerSO.header.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedBetslipSO.counter, "Betslip was not minimized");

        await swipeFromElementToElement(firstMarketRunnerSportsbookSO.element, secondMarketRunnerSportsbookSO.element);

        await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_SGM_MOCK));
        await browser.waitUntilClickableNative(
          secondMarketRunnerSportsbookSO.element,
          "Second bet button is not clickable",
        );
        await secondMarketRunnerSportsbookSO.element.click();

        await swipeFromElementToElement(secondMarketRunnerSportsbookSO.element, thirdMarketRunnerSportsbookSO.element);
        await mockService.mockHttpRequest(getImplyBetsResponse(SECOND_SGM_MOCK));
        await browser.waitUntilDisplayed(thirdMarketRunnerSportsbookSO.element, "Third bet button is not visible");
        await browser.waitUntilClickableNative(
          thirdMarketRunnerSportsbookSO.element,
          "Third bet button is not clickable",
        );
        await thirdMarketRunnerSportsbookSO.element.click();
      });

      describe("and the user inserts stake values for both bet builders", () => {
        beforeAll(async () => {
          await browser.waitUntilContainsText(sportsbookMinimizedBetslipSO.counter, "3", "Bet count not updated");
          await sportsbookMinimizedBetslipSO.element.click();

          await browser.waitUntilClickableNative(
            firstBetBuilderStakeInputFieldSO.numberField,
            "First stake field is not accessible",
          );
          await firstBetBuilderStakeInputFieldSO.numberField.click();
          await firstBetBuilderStakeInputFieldSO.setValue(0.12);
        });

        describe("and advances to confirm step", () => {
          beforeAll(async () => {
            await advanceToConfirmStep(confirmButtonsElements);
          });

          it("[PRPI-4006] should display the selected bet builders", async () => {
            expect(await firstBetBuilderSO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-4007] Should display 3 selections in the first accordion", async () => {
            expect(await firstSelectionBoardSO.title.getText()).toBe("3 Selections");
          });

          it("[PRPI-4008] should display the edit button", async () => {
            expect(await editButtonSO.element.isDisplayed()).toBe(true);
            expect(await editButtonSO.element.isEnabled()).toBe(true);
          });

          it("[PRPI-4009] should display the confirm button", async () => {
            expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
            expect(await confirmButtonSO.element.isEnabled()).toBe(true);
          });

          describe("and one of the runners gets suspended", () => {
            beforeAll(async () => {
              await Promise.all([
                mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_FIRST_UPDATE)),
                mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIRST_UPDATE_FAILURES)),
              ]);

              await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
              await browser.waitUntilDisplayed(placeNotification.element, "The notification is not displayed");
            });

            it("[PRPI-4010] should disable the confirm button", async () => {
              expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
              expect(await confirmButtonSO.element.isEnabled()).toBe(false);
            });

            it("[PRPI-4010] should display availability notification", async () => {
              expect(await placeNotification.message.getText()).toBe("Odds and availability have changed");
            });

            describe("and the user clicks on the edit button", () => {
              beforeAll(async () => {
                await browser.waitUntilClickableNative(editButtonSO.element, "Edit button is not clickable");
                await editButtonSO.element.click();

                await browser.waitUntilNotInDOM(confirmButtonSO.element, "Confirm button is not here");
                await browser.waitUntilClickableNative(placeButtonSO.element, "Edit button is not clickable");
              });

              it("[PRPI-4010] should return to place potential step", async () => {
                expect(await sportsbookPlacePanelSO.element.isDisplayed()).toBe(true);
                expect(await placeButtonSO.element.isDisplayed()).toBe(true);
                expect(await placeButtonSO.element.isEnabled()).toBe(true);
              });

              describe("and the user adds a new stake for the available bets", () => {
                beforeAll(async () => {
                  await browser.waitUntilClickableNative(
                    firstBetBuilderStakeInputFieldSO.numberField,
                    "First stake field is not accessible",
                  );

                  await firstBetBuilderStakeInputFieldSO.numberField.setValue(1);
                });

                describe("and advances to confirm step", () => {
                  beforeAll(async () => {
                    await advanceToConfirmStep(confirmButtonsElements);
                  });

                  it("[PRPI-4010] should display the selected bet builders", async () => {
                    expect(await firstBetBuilderSO.element.isDisplayed()).toBe(true);
                  });

                  it("[PRPI-4010] Should display 2 selections in the first accordion", async () => {
                    expect(await firstSelectionBoardSO.title.getText()).toBe("2 Selections");
                  });

                  it("[PRPI-4010] should display the edit button", async () => {
                    expect(await editButtonSO.element.isDisplayed()).toBe(true);
                    expect(await editButtonSO.element.isEnabled()).toBe(true);
                  });

                  it("[PRPI-4010] should display the confirm button", async () => {
                    expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
                    expect(await confirmButtonSO.element.isEnabled()).toBe(true);
                  });

                  describe("when the market opens again", () => {
                    beforeAll(async () => {
                      await Promise.all([
                        mockService.mockHttpRequest(getMarketPrices(SMP_MOCK)),
                        mockService.mockHttpRequest(getImplyBetsResponse(SECOND_SGM_MOCK)),
                      ]);

                      await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
                    });

                    it("[PRPI-4010] should disable confirm button and display availability notification", async () => {
                      expect(await placeNotification.message.getText()).toBe("Odds and availability have changed");
                      expect(await confirmButtonSO.element.isEnabled()).toBe(false);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
