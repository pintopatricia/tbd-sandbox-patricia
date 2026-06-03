const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getSportsLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");

const { swipeUp, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  HeaderSO,
  GenericScreenSO,
  SingleSO,
  CardSO,
  BetslipDrawerSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  AlertSO,
  CurrencyNumberInputFieldSO,
  PrimaryButtonSO,
  BetControlsSO,
  BetsSummarySO,
} = require("../../../../../screen-objects");

const genericScreenSO = new GenericScreenSO();
const headerSO = new HeaderSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSbkMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const secondSbkMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
const firstSbkRunnerSO = new SportsbookBetButtonSO(firstSbkMarketSO.sbkBetButtons[0]);
const secondSbkRunnerSO = new SportsbookBetButtonSO(secondSbkMarketSO.sbkBetButtons[0]);
const sportsbookMinimizedBetslipSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const alertSO = new AlertSO(sportsbookPlacePanelSO.element);
const firstSingleSO = new SingleSO(sportsbookPlacePanelSO.element);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const singleStakeInputField = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);
const singlePlaceButtonSO = new PrimaryButtonSO();
const singleBetsSummarySO = new BetsSummarySO(sportsbookPlacePanelSO.element);
const multiplePlaceButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);
const multipleBetsSummarySO = new BetsSummarySO(sportsbookPlacePanelSO.element);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
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

const WALLET_MOCK = [
  { amount: "5.00", walletName: "MAIN" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
];

describe("Betslip - Sportsbook Deposit to Place Bet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");
  });

  describe("When I try to place a single bet with an amount higher than the available wallet funds", () => {
    beforeAll(async () => {
      await browser.waitUntilEquals(headerSO.balance, "$5.00");
      await browser.waitUntilClickableNative(firstSbkRunnerSO.element);
      await firstSbkRunnerSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Selection hasn't been added");

      await singleStakeInputField.numberField.click();
      await singleStakeInputField.numberField.setValue(9);
      await hideKeyboard();
      await browser.waitUntilDisplayed(alertSO.element);
      await browser.waitUntilEquals(singlePlaceButtonSO.label, "Deposit to Place $9.00 Bet");
    });

    it("[PRPI-3376] The betslip should display CTA button with the text `Deposit to Place $9.00 Bet`", async () => {
      expect(await singlePlaceButtonSO.label.getText()).toBe("Deposit to Place $9.00 Bet");
    });

    it("[PRPI-3377] The betslip should display an insufficient funds notification", async () => {
      expect(await alertSO.message.getText()).toBe("Not enough money in your main wallet.");
    });

    it("[PRPI-4082] should display 'Balance After Bet' with 'N/A'", async () => {
      expect(await singleBetsSummarySO.leftSegmentLabel.getText()).toBe("Balance After Bet");
      expect(await singleBetsSummarySO.leftSegmentValue.getText()).toBe("N/A");
    });
  });

  describe("When I try to place a multiple bet with an amount higher than the available wallet funds", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await swipeUp(0.5); // swipe to the bottom of the screen to reveal last card
      await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await browser.waitUntilClickableNative(secondSbkRunnerSO.element);
      await secondSbkRunnerSO.element.click();

      await browser.waitUntilDisplayed(sportsbookMinimizedBetslipSO.counter);
      await browser.waitUntilContainsText(sportsbookMinimizedBetslipSO.counter, "2", "Bet count not updated");
      await browser.waitUntilClickableNative(sportsbookMinimizedBetslipSO.title);
      await sportsbookMinimizedBetslipSO.title.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Multiples panel hasn't been expanded");
    });

    it("[PRPI-3378] The betslip should display CTA button with the text `Deposit to Place $9.00 Bet`", async () => {
      expect(await multiplePlaceButtonSO.label.getText()).toBe("Deposit to Place $9.00 Bet");
    });

    it("[PRPI-3379] The betslip should display an insufficient funds notification", async () => {
      expect(await alertSO.message.getText()).toBe("Not enough money in your main wallet.");
    });
    it("[PRPI-4083] should display 'Balance After Bet' with 'N/A'", async () => {
      expect(await multipleBetsSummarySO.leftSegmentLabel.getText()).toBe("Balance After Bet");
      expect(await multipleBetsSummarySO.leftSegmentValue.getText()).toBe("N/A");
    });
  });
});
