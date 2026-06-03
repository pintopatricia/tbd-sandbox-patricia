const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");

const { swipeUp, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  SportsbookReceiptPanelSO,
  GenericScreenSO,
  SinglesCardSO,
  SingleSO,
  CardSO,
  BetslipDrawerSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  CurrencyNumberInputFieldSO,
  ActionButtonSO,
  BetDetailsSO,
  BetControlsSO,
} = require("../../../../../screen-objects");

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSbkMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const secondSbkMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
const firstSbkRunnerSO = new SportsbookBetButtonSO(firstSbkMarketSO.sbkBetButtons[0]);
const secondSbkRunnerSO = new SportsbookBetButtonSO(secondSbkMarketSO.sbkBetButtons[0]);
const sportsbookMinimizedBetslipSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiplePlaceButtonSO = new ActionButtonSO(sportsbookPlacePanelSO.place);
const singlePlacePanelBetDetailsSO = new BetDetailsSO(sportsbookPlacePanelSO.element);
const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);

const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const secondSingleSO = new SingleSO(singlesCardSO.singles[1]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const secondSingleControlsSO = new BetControlsSO(secondSingleSO.controls);
const firstSingleStakeSO = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);
const secondSingleStakeSO = new CurrencyNumberInputFieldSO(secondSingleControlsSO.currencyInput);
const firstSingleBetDetailsSO = new BetDetailsSO(firstSingleSO.element);
const secondSingleBetDetailsSO = new BetDetailsSO(secondSingleSO.element);
const receiptPanelSO = new SportsbookReceiptPanelSO();
const firstSingleReceiptBetDetailsSO = new BetDetailsSO(receiptPanelSO.singles[0]);
const secondSingleReceiptBetDetailsSO = new BetDetailsSO(receiptPanelSO.singles[1]);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      guaranteedPriceAvailable: true,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      guaranteedPriceAvailable: true,
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "5",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "6",
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
                  name: "Team A vs Team B ",
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
                      urn: "ppb:sbkMarket:924.1",
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
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team B",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team A",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1/1" },
                      { runnerURN: "ppb:sbkRunner:924.1/2" },
                      { runnerURN: "ppb:sbkRunner:924.1/3" },
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
                  name: "Team A 2 vs Team B 2",
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
                      urn: "ppb:sbkMarket:924.2",
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
                          runnerURN: "ppb:sbkRunner:924.2/4",
                          selectionId: 4,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/5",
                          selectionId: 5,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/6",
                          selectionId: 6,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/4" },
                      { runnerURN: "ppb:sbkRunner:924.2/5" },
                      { runnerURN: "ppb:sbkRunner:924.2/6" },
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

const HOME_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "/view/generic:home",
  edges: [...BFF_MOCK.edges],
  partialEdges: [...BFF_MOCK.partialEdges],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const FIRST_SINGLE_ODDS_MOCK = {
  availablePriceTypes: ["LIVE_PRICE", "GUARANTEED_PRICE"],
  runner: {
    marketId: "924.1",
    selectionId: 1,
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

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 4,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const SECOND_SINGLE_ODDS_MOCK = {
  availablePriceTypes: ["LIVE_PRICE", "GUARANTEED_PRICE"],
  runner: {
    marketId: "924.2",
    selectionId: 4,
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
      numLines: 1,
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

const SPB_MOCK = {
  result: [
    {
      runners: [
        {
          runner: {
            marketId: "924.1",
            selectionId: 1,
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              {
                runner: {
                  marketId: "924.1",
                  selectionId: 1,
                },
              },
            ],
          },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2.5,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2.5 } },
      originalTotalPotentialWin: 2,
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
    {
      runners: [
        {
          runner: {
            marketId: "924.2",
            selectionId: 4,
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              {
                runner: {
                  marketId: "924.2",
                  selectionId: 4,
                },
              },
            ],
          },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
  ],
};

describe("Betslip - BOG", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");
  });

  describe("When the betslip place panel is opened with 1 selection that has BOG", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstSbkRunnerSO.element);
      await firstSbkRunnerSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Selection hasn't been added");
      await browser.waitUntilDisplayed(
        singlePlacePanelBetDetailsSO.bog,
        "BOG signposting wasn't displayed in single place panel",
      );
    });

    it("[PRPI-3557] The bet details should display with BOG signposting", async () => {
      expect(await singlePlacePanelBetDetailsSO.bog.isDisplayed()).toBe(true);
    });

    describe("When I add a second selection with BOG to the betslip", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(betslipDrawerSO.header);
        await betslipDrawerSO.header.click();
        await swipeUp(0.5); // swipe to the bottom of the screen to reveal last card
        await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");

        await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
        await browser.waitUntilClickableNative(secondSbkRunnerSO.element);
        await secondSbkRunnerSO.element.click();

        await browser.waitUntilDisplayed(sportsbookMinimizedBetslipSO.counter);
        await browser.waitUntilClickableNative(sportsbookMinimizedBetslipSO.element);
        await sportsbookMinimizedBetslipSO.element.click();
        await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Multiples panel hasn't been expanded");

        await swipeUp(0.6);
        await browser.waitUntilDisplayed(secondSingleBetDetailsSO.element, "Second single not visible");

        await browser.waitUntilDisplayed(
          firstSingleBetDetailsSO.bog,
          "BOG signposting wasn't displayed in first single",
        );
        await browser.waitUntilDisplayed(
          secondSingleBetDetailsSO.bog,
          "BOG signposting wasn't displayed in second single",
        );
      });

      it("[PRPI-3558] The first single bet details should display with BOG signposting", async () => {
        expect(await firstSingleBetDetailsSO.bog.isDisplayed()).toBe(true);
      });

      it("[PRPI-3559] The second single bet details should display with BOG signposting", async () => {
        expect(await secondSingleBetDetailsSO.bog.isDisplayed()).toBe(true);
      });

      describe("When I place both bets", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));

          await firstSingleStakeSO.numberField.click();
          await firstSingleStakeSO.numberField.setValue(1);
          await hideKeyboard();

          await secondSingleStakeSO.numberField.click();
          await secondSingleStakeSO.numberField.setValue(2);
          await hideKeyboard();

          await browser.waitUntilClickableNative(multiplePlaceButtonSO.element);
          await multiplePlaceButtonSO.element.click();
          await browser.waitUntilDisplayed(receiptPanelSO.element, "Receipt panel wasn't displayed");
        });

        it("[PRPI-3560] The first single bet receipt should display with BOG signposting", async () => {
          expect(await firstSingleReceiptBetDetailsSO.bog.isDisplayed()).toBe(true);
        });

        it("[PRPI-3561] The second single bet receipt should display with BOG signposting", async () => {
          expect(await secondSingleReceiptBetDetailsSO.bog.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
