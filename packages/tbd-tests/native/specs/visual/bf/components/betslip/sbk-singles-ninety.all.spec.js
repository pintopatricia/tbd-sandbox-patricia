const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const {
  getAppContext,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../../helpers/urls");
const { hideKeyboard } = require("../../../../../helpers/gestures");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  SportsbookReceiptPanelSO,
  GenericScreenSO,
  SinglesCardSO,
  SingleSO,
  SportsbookPlacePanelSO,
  CardSO,
  SportsbookMarketSO,
  RunnerSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  BetDetailsSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
// place screen objects
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const firstBetDetailsSO = new BetDetailsSO(firstSingleSO.element);

const singleSO = new SingleSO(sportsbookPlacePanelSO.element);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const sportsbookSinglePlaceSizeInputField = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);

const primaryButtonSO = new PrimaryButtonSO();
const firstNinetyMinSO = firstBetDetailsSO.ninetyMinIcon;

const receiptPanelSO = new SportsbookReceiptPanelSO();
const singleReceiptBetDetailsSO = new BetDetailsSO(receiptPanelSO.singles[0]);
const secondNinetyMinSO = singleReceiptBetDetailsSO.ninetyMinIcon;

const EVENT_ID = "1";

const APP_CONTEXT_MOCK = {
  throttles: {
    CUSTOM_KEYBOARD: {
      isActive: true,
    },
  },
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_ID}`,
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##MATCH_ODDS_90",
        cardTitle: "Match Odds 90",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.1",
              noLiveData: true,
              name: "Match Odds 90",
              marketType: "MATCH_ODDS_90",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Team A vs Team B",
                  urn: `ppb:event:29359895`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                  selectionId: 1,
                  name: "Team A",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.1/2",
                  selectionId: 2,
                  name: "Draw",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.1/3",
                  selectionId: 3,
                  name: "Team B",
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

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##MATCH_ODDS_90",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const FIRST_RUNNER = { marketId: "924.1", selectionId: 1 };

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [FIRST_RUNNER],
    },
  ],

  canPlaceEachwayBet: true,
  availablePriceTypes: ["STARTING_PRICE", "LIVE_PRICE"],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  availablePriceTypes: ["STARTING_PRICE", "LIVE_PRICE"],
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      runners: [{ runner: FIRST_RUNNER }],
      legs: [{ leg: { betRunners: [{ runner: FIRST_RUNNER }] } }],
      totalPotentialWin: 2,
      totalStake: 1,
      wallets: [{ amount: 1, type: "DEPOSITS" }],
    },
  ],
};

const CARD_NAME = "betslip_sbk_bet_single_";

describe("Betslip - SBK place single bet with match odds 90 market", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));

    const HOME_VIEW_LINK = getStartViewLink(`football/s-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when the user adds two combinable selections", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();

      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );

      await browser.waitUntilDisplayed(firstNinetyMinSO);

      await browser.waitUntilImageEquals(
        `${CARD_NAME}[PRPI-4898]_should_show_ninety_min_signposting_and_ew_and_sp_options_from_the_single_bets`,
      );
    });

    it("[PRPI-4898]_should_show_ninety_min_signposting_and_ew_and_sp_options_from_the_single_bets", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}[PRPI-4898]_should_show_ninety_min_signposting_and_ew_and_sp_options_from_the_single_bets`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("when the user places a bet", () => {
      beforeAll(async () => {
        await sportsbookSinglePlaceSizeInputField.numberField.click();
        await sportsbookSinglePlaceSizeInputField.numberField.setValue(1);
        await hideKeyboard();

        await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
        await browser.waitUntilDisplayed(primaryButtonSO.element);

        await primaryButtonSO.element.click();

        await browser.waitUntilDisplayed(secondNinetyMinSO);

        await browser.waitUntilImageEquals(
          `${CARD_NAME}[PRPI-4899]_should_show_ninety_min_signposting_from_the_betreceipt_singles_card`,
        );
      });

      it("[PRPI-4899]_should_show_ninety_min_signposting_from_the_betreceipt_singles_card", async () => {
        expect(
          (
            await browser.compareScreen(
              `${CARD_NAME}[PRPI-4899]_should_show_ninety_min_signposting_from_the_betreceipt_singles_card`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
