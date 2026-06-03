const EventMarketCardSO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.so");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const {
  getSportsLayout,
  getAppContext,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { hideKeyboard, swipeUpElement } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { advanceToConfirmStep } = require("../../../../../helpers/confirm-bets");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  SportPageScreenSO,
  SinglesCardSO,
  SingleSO,
  CardSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  BetControlsSO,
  CurrencyNumberInputFieldSO,
  PrimaryButtonSO,
  SecondaryButtonSO,
  AlertSO,
  InlineSportsbookMarketSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const sportScreenSO = new SportPageScreenSO();

const firstEventMarketCardSO = new EventMarketCardSO(sportScreenSO.eventMarketCards[0]);
const secondEventMarketCardSO = new EventMarketCardSO(sportScreenSO.eventMarketCards[1]);

const firstMatchOddsCard = new CardSO(firstEventMarketCardSO.element);
const secondMatchOddsCard = new CardSO(secondEventMarketCardSO.element);

const firstSbkMarketSO = new InlineSportsbookMarketSO(firstMatchOddsCard.contentWrapper);
const secondSbkMarketSO = new InlineSportsbookMarketSO(secondMatchOddsCard.contentWrapper);

const firstSbkRunnerSO = new SportsbookBetButtonSO(firstSbkMarketSO.sbkBetButtons[0]);
const secondSbkRunnerSO = new SportsbookBetButtonSO(secondSbkMarketSO.sbkBetButtons[0]);

const betslipDrawerSO = new BetslipDrawerSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

const minimizedSO = new MinimizedSO();
const betControlsSO = new BetControlsSO();
const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const secondSingleSO = new SingleSO(singlesCardSO.singles[1]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.element);
const secondSingleControlsSO = new BetControlsSO(secondSingleSO.element);
const sportsbookStakeInputField1 = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);
const sportsbookStakeInputField2 = new CurrencyNumberInputFieldSO(secondSingleControlsSO.currencyInput);
const notificationSO = new AlertSO(sportsbookPlacePanelSO.element);

const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);
const editButtonSO = new SecondaryButtonSO(sportsbookPlacePanelSO.actions[0]);
const confirmButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.actions[1]);

const confirmButtonsElements = {
  placeButtonElement: placeButtonSO.element,
  editButtonElement: editButtonSO.element,
};

const APP_CONTEXT_MOCK = {
  currencyCode: "BRL",
  countryCode: "BR",
  loggedIn: "true",
  products: ["sportsbook"],
  throttles: {
    BET_CONFIRMATION_STEP: { isActive: true },
  },
};

const EVENT_TYPE_ID = 1;

const MARKET_A_ID = "924.1";
const MARKET_B_ID = "924.2";
const MARKET_C_ID = "924.3";

const SELECTION_A_ID = 1;
const SELECTION_B_ID = 2;
const SELECTION_C_ID = 3;

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_A_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_B_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_C_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Team A vs Team B",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team B",
                  },
                  away: {
                    name: "Team A",
                  },
                },
                sportevent: {
                  name: "Team B vs Team A",
                  urn: "ppb:event:29359895",
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
                      urn: `ppb:sbkMarket:${MARKET_A_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B v Team A",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_C_ID}` },
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
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League 2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Team A 2 vs Team B 2",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team B 2",
                  },
                  away: {
                    name: "Team A 2",
                  },
                },
                sportevent: {
                  name: "Team B 2 vs Team A 2",
                  urn: "ppb:event:29359896",
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
                      urn: `ppb:sbkMarket:${MARKET_B_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 2 v Team A 2",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_C_ID}` },
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
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_A_ID,
          selectionId: SELECTION_A_ID,
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
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_A_ID,
    selectionId: SELECTION_A_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_B_ID,
          selectionId: SELECTION_A_ID,
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
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_B_ID,
    selectionId: SELECTION_A_ID,
  },
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
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const SMP_MOCK_FIRST_UPDATE = {
  markets: [
    {
      selectionId: String(SELECTION_A_ID),
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runnerStatus: "SUSPENDED",
    },
    {
      selectionId: String(SELECTION_B_ID),
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      selectionId: String(SELECTION_C_ID),
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.3 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],
};

const MARKETS_FIRST_UPDATE_FAILURES = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, DOUBLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: MARKET_A_ID,
        selectionId: SELECTION_A_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

describe("Singles Confirm Experience", () => {
  describe("when one selection is added to betslip", () => {
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
      await browser.waitUntilDisplayed(sportScreenSO.element);

      await browser.waitUntilEquals(firstSbkRunnerSO.odd, "1.1");
      await firstSbkRunnerSO.element.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "First selection hasn't been added");

      // dismiss the maximum payout notification
      await notificationSO.action.click();
    });

    it("[PRPI-3375] should open betslip with a single selection", async () => {
      expect(await sportsbookPlacePanelSO.element.isDisplayed()).toBe(true);
    });

    describe("when adding another combinable selection to betslip", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(betslipDrawerSO.header);
        await betslipDrawerSO.header.click();

        await browser.waitUntilDisplayed(minimizedSO.counter, "Betslip was not minimized");

        await browser.waitUntilDisplayed(secondSbkRunnerSO.element, "Second runner bet button not visible");

        await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));

        await browser.waitUntilClickableNative(secondSbkRunnerSO.element);
        await secondSbkRunnerSO.element.click();

        await browser.waitUntilDisplayed(minimizedSO.counter);
        await browser.waitUntilClickableNative(minimizedSO.counter);
        await minimizedSO.counter.click();

        await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Betslip still minimized");
      });

      it("[PRPI-4067] should change betslip to multiples experience", async () => {
        expect(await sportsbookPlacePanelSO.element.isDisplayed()).toBe(true);
        expect(await placeButtonSO.element.isDisplayed()).toBe(true);
      });
    });

    describe("and the user adds stake value to both singles", () => {
      beforeAll(async () => {
        await swipeUpElement(sportsbookPlacePanelSO.element, 500);

        await browser.waitUntilClickableNative(sportsbookStakeInputField1.numberField);
        await sportsbookStakeInputField1.numberField.setValue(0.12);

        await swipeUpElement(sportsbookPlacePanelSO.element);

        await browser.waitUntilClickableNative(sportsbookStakeInputField2.numberField);
        await sportsbookStakeInputField2.numberField.setValue(1);
        await hideKeyboard();
      });

      describe("when the user advances to confirm step", () => {
        beforeAll(async () => {
          await advanceToConfirmStep(confirmButtonsElements);
        });

        it("[PRPI-4075] should display the confirm screen", async () => {
          await browser.waitUntilDisplayed(confirmButtonSO.element);
          await browser.waitUntilClickableNative(confirmButtonSO.element);

          expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
          expect(await confirmButtonSO.element.getAttribute("enabled")).toBe("true");
        });

        it("[PRPI-4076] should display two singles", async () => {
          expect(await betControlsSO.element.isDisplayed()).toBe(true);
          expect(await singlesCardSO.singles.length).toBe(2);
        });
      });

      describe("and one of the runners gets suspended", () => {
        beforeAll(async () => {
          await Promise.all([
            mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_FIRST_UPDATE)),
            mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIRST_UPDATE_FAILURES)),
          ]);

          await browser.waitUntilEquals(notificationSO.message, "Odds and availability have changed");
          await browser.waitUntilDisplayed(notificationSO.element, "The notification is not displayed");
        });

        it("[PRPI-4077] should disable the confirm button", async () => {
          expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
          expect(await confirmButtonSO.element.isEnabled()).toBe(false);
        });
      });

      describe("and the user clicks the edit button", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(editButtonSO.element);

          await editButtonSO.element.click();
        });

        it("[PRPI-4078] should return to place potential step", async () => {
          await browser.waitUntilNotInDOM(confirmButtonSO.element);
          await browser.waitUntilClickableNative(placeButtonSO.element);

          expect(await placeButtonSO.element.isDisplayed()).toBe(true);
          expect(await placeButtonSO.element.isEnabled()).toBe(true);
        });

        describe("and the user advances to confirm step", () => {
          beforeAll(async () => {
            await advanceToConfirmStep(confirmButtonsElements);
          });

          it("[PRPI-4079] should display the confirm screen", async () => {
            await browser.waitUntilClickableNative(confirmButtonSO.element, "confirm button not here");

            expect(await editButtonSO.element.isDisplayed()).toBe(true);
            expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
            expect(await confirmButtonSO.element.isEnabled()).toBe(true);
          });

          it("[PRPI-4080] should display a single", async () => {
            expect(await betControlsSO.element.isDisplayed()).toBe(true);
            expect(await singlesCardSO.element.isDisplayed()).toEqual(true);
          });

          describe("when the staked and suspended single gets available again", () => {
            beforeAll(async () => {
              await Promise.all([
                mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
                mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK)),
              ]);

              await browser.waitUntilEquals(notificationSO.message, "Odds and availability have changed");
              await browser.waitUntilDisplayed(notificationSO.element, "The notification is not displayed");
            });

            it("[PRPI-4081] should disable the confirm button", async () => {
              expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
              expect(await confirmButtonSO.element.isEnabled()).toBe(false);
            });

            describe("and the user clicks the edit button", () => {
              beforeAll(async () => {
                await browser.waitUntilClickableNative(editButtonSO.element);

                await editButtonSO.element.click();
              });

              it("[PRPI-4081] should return to place potential step", async () => {
                expect(await placeButtonSO.element.isDisplayed()).toBe(true);
                expect(await placeButtonSO.element.isEnabled()).toBe(true);
              });
            });
          });
        });
      });
    });
  });
});
