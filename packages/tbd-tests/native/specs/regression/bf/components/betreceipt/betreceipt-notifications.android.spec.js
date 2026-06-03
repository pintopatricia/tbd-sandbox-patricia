const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  BetslipDrawerSO,
  SportsbookMarketSO,
  CardSO,
  RunnerSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  BetsSummarySO,
  BetControlsSO,
  OptionSO,
  SwitchSO,
  GenericScreenSO,
  MultiplesCardSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.element);
const multipleControlsSO = new BetControlsSO(multiplesCardSO.element);

const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const placeButtonSO = new PrimaryButtonSO();

const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);
const betsSummarySO = new BetsSummarySO();
const multipleStakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);

// receipt screen objects
const optionSO = new OptionSO(sportsbookReceiptPanelSO.element);
const switchSO = new SwitchSO(optionSO.toggle);

const EVENT_TYPE_ID = 1;
const EVENT_ID = "29359895";

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.193270253",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
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
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        title: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.193270252",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.193270252/48044",
                  selectionId: 48044,
                  name: "Man City",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.193270252/58805",
                  selectionId: 58805,
                  name: "The Draw",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.193270252/48351",
                  selectionId: 48351,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
              { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
              { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
            ],
          },
        },
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436224:MATCH_ODDS",
        title: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.193270253",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.193270253/48044",
                  selectionId: 48044,
                  name: "Man City",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.193270253/58805",
                  selectionId: 58805,
                  name: "The Draw",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.193270253/48351",
                  selectionId: 48351,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.193270253/48044" },
              { runnerURN: "ppb:sbkRunner:924.193270253/58805" },
              { runnerURN: "ppb:sbkRunner:924.193270253/48351" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: { urn: "ppb:tbd:card:29436223:MATCH_ODDS", __typename: "MarketCard" },
    },
    {
      node: { urn: "ppb:tbd:card:29436224:MATCH_ODDS", __typename: "MarketCard" },
    },
  ],
};

const PLACE_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 1 },
      },
      runners: [
        {
          runner: { marketId: "924.193270252", selectionId: 48044 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          runner: { marketId: "924.193270253", selectionId: 48044 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.193270252", selectionId: 48044 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.193270253", selectionId: 48044 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalPotentialWin: 2,
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.193270252",
          selectionId: 48044,
        },
      ],
    },
  ],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.193270252",
    selectionId: 48044,
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
          marketId: "924.193270253",
          selectionId: 48044,
        },
      ],
    },
  ],
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.193270253",
    selectionId: 48044,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
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
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        decimalDisplayOdds: { decimalOdds: 2.4 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

describe("Betreceipt Notifications", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getPlaceBet(PLACE_SUCCESS));

    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("When the user places a bet", () => {
    beforeAll(async () => {
      // Fist selection
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );

      // Second Selection
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilEquals(minimizedSO.counter, "1");
      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await browser.waitUntilClickableNative(secondRunnerSO.sbkBetButtons[0]);
      await secondRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilEquals(minimizedSO.counter, "2");

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilEquals(betsSummarySO.totalReturnsLabel, "Total Returns");

      // Bet placement
      await browser.waitUntilDisplayed(multipleStakeInputFieldSO.element, "Waiting for multiple stake input field");
      await multipleStakeInputFieldSO.numberField.setValue(0.12);
      await hideKeyboard();

      await browser.waitUntilClickableNative(placeButtonSO.element);
      await placeButtonSO.element.click();
      await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for receipt panel element");
    });

    it("[PRPI-3284] The toggle should be displayed with correct content", async () => {
      expect(await optionSO.title.getText()).toBe("Receive Live Alerts");
      expect(await optionSO.toggle.isDisplayed()).toBe(true);
      expect(await switchSO.switch.getAttribute("selected")).toBe("false");
    });
  });
});
