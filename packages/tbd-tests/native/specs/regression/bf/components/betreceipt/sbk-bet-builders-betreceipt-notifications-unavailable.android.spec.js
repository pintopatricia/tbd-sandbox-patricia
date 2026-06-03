const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getNSSRegister, getNSSSubscribeUnavailable } = require("@ppb/tbd-shared/mocks/nss/nss.controller");

const {
  getAppContext,
  getEventLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { hideKeyboard } = require("../../../../../helpers/gestures");

const {
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  BetBuildersCardSO,
  BetBuilderSO,
  CardSO,
  SportsbookMarketSO,
  RunnerSO,
  BetslipDrawerSO,
  MinimizedSO,
  BetControlsSO,
  BetSummarySO,
  ReceiptTitleSO,
  CurrencyNumberInputFieldSO,
  PrimaryButtonSO,
  OptionSO,
  SwitchSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const placePanelSO = new SportsbookPlacePanelSO();
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();

const receiptTitleSO = new ReceiptTitleSO();
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();

const betBuildersCardSO = new BetBuildersCardSO(placePanelSO.element);
const firstBetBuilderSO = new BetBuilderSO(betBuildersCardSO.betBuilders[0]);
const firstBetControlsSO = new BetControlsSO(firstBetBuilderSO.element);
const firstStakeSO = new CurrencyNumberInputFieldSO(firstBetControlsSO.currencyInput);
const genericScreenSO = new GenericScreenSO();

const betBuildersSummarySO = new BetSummarySO(sportsbookReceiptPanelSO.betBuilderSummaries[0]);

const placeButtonSO = new PrimaryButtonSO(placePanelSO.place);

// receipt screen objects
const optionSO = new OptionSO(sportsbookReceiptPanelSO.element);
const switchSO = new SwitchSO(optionSO.toggle);

const EVENT_ID = "29359895";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "FC Porto v SL Benfica",
    competition: { urn: "ppb:competition:12345", name: "Portuguese League" },
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`,
        title: "Match Odds - FC Porto v SL Benfica",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "FC Porto v SL Benfica",
            urn: `ppb:event:${EVENT_ID}`,
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.11111111",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "FC Porto v SL Benfica",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.11111111/11111",
                  selectionId: 11111,
                  name: "Porto",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.11111111/11111" }],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}##HALF_TIME`,
        title: "Half Time - FC Porto v SL Benfica",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "FC Porto v SL Benfica",
            urn: `ppb:event:${EVENT_ID}`,
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.22222222",
              noLiveData: true,
              name: "Half Time",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "FC Porto v SL Benfica",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.22222222/44444",
                  selectionId: 44444,
                  name: "Porto",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.22222222/44444" }],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}##CORRECT_SCORE`,
        title: "Correct Score - FC Porto v SL Benfica",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "FC Porto v SL Benfica",
            urn: `ppb:event:${EVENT_ID}`,
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.55555555",
              noLiveData: true,
              name: "Correct Score",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "FC Porto v SL Benfica",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.55555555/22333",
                  selectionId: 22333,
                  name: "1-0",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.55555555/22333" }],
          },
        },
      },
    },
  ],

  partialEdges: [
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`, __typename: "MarketCard" } },
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##HALF_TIME`, __typename: "MarketCard" } },
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##CORRECT_SCORE`, __typename: "MarketCard" } },
  ],
};

const SMP_FIRST_MARKET = {
  marketId: "924.11111111",
  runnerDetails: [
    {
      selectionId: "11111",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],
};

const SMP_SECOND_MARKET = {
  marketId: "924.22222222",
  runnerDetails: [
    {
      selectionId: "44444",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],
};

const SMP_THIRD_MARKET = {
  marketId: "924.55555555",
  runnerDetails: [
    {
      selectionId: "22333",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [SMP_FIRST_MARKET, SMP_SECOND_MARKET, SMP_THIRD_MARKET],
};

const FIRST_RUNNER = { marketId: "924.11111111", selectionId: 11111, eventURN: `ppb:event:${EVENT_ID}` };

const FIRST_SINGLE_MOCK = { legCombinations: [{ runners: [FIRST_RUNNER] }] };
const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const ONE_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_RUNNER = { marketId: "924.22222222", selectionId: 44444, eventURN: `ppb:event:${EVENT_ID}` };

const SECOND_SINGLE_MOCK = { legCombinations: [{ runners: [SECOND_RUNNER] }] };
const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TWO_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_RUNNER = { marketId: "924.55555555", selectionId: 22333, eventURN: `ppb:event:${EVENT_ID}` };

const THIRD_SINGLE_MOCK = { legCombinations: [{ runners: [THIRD_RUNNER] }] };
const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_SGM = {
  betType: "TREBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 4.5,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 4.5,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 4.5 } },
    decimalDisplayOdds: { decimalOdds: 4.5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_SGM_ODD_MOVEMENT = {
  betType: "TREBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 5,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 5,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 5 } },
    decimalDisplayOdds: { decimalOdds: 5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_SGM_MOCK = {
  betCombinations: [TREBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const TREBLE_SGM_MOVEMENT_MOCK = {
  betCombinations: [TREBLE_SGM_ODD_MOVEMENT, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["SGM"],
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      runners: [{ runner: FIRST_RUNNER }, { runner: SECOND_RUNNER }, { runner: THIRD_RUNNER }],
      legs: [
        { leg: { betRunners: [{ runner: FIRST_RUNNER }] } },
        { leg: { betRunners: [{ runner: SECOND_RUNNER }] } },
        { leg: { betRunners: [{ runner: THIRD_RUNNER }] } },
      ],

      totalPotentialWin: 4.5,
      totalStake: 1,
    },
  ],
};

const NSS_BETBUILDER_MOCK = {
  topics: [
    {
      topicId: EVENT_ID,
      eventType: "FOOTBALL",
      incidentTypes: [
        "FOOTBALL_KICK_OFF",
        "FOOTBALL_HALF_TIME",
        "FOOTBALL_FINAL_SCORE",
        "FOOTBALL_RED_CARD",
        "FOOTBALL_SCORE_CHANGE",
      ],
    },
  ],

  applicationTypeId: "applicationTypeIdTest",
  deviceId: "deviceIdTest",
  locale: "en_GB",
};

const togglePush = async () => {
  await browser.waitUntilDisplayed(switchSO.switch);
  await browser.waitUntilClickableNative(switchSO.switch);
  await switchSO.switch.click();
  await optionSO.toggle.waitForDisplayed({ reverse: true });
};

const placeBetBuilderBet = async () => {
  await mockService.mockHttpRequest(getImplyBetsResponse(ONE_SINGLE_MOCK));
  await browser.waitUntil(async () => (await genericScreenSO.cards.length) === 3);

  const loadedGenericScreenSO = new GenericScreenSO();
  const firstCardSO = new CardSO(loadedGenericScreenSO.cards[0]);
  const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
  const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);

  await browser.waitUntilDisplayed(firstRunnerSO.sbkBetButtons[0], "First bet button is not visible");
  await firstRunnerSO.sbkBetButtons[0].click();
  await browser.waitUntilDisplayed(placePanelSO.element, "First selection hasn't been added");

  await browser.waitUntilClickableNative(betslipDrawerSO.header);
  await betslipDrawerSO.header.click();
  await browser.waitUntilDisplayed(minimizedSO.element, "Singles panel hasn't been minimized");

  const secondCardSO = new CardSO(loadedGenericScreenSO.cards[1]);
  const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
  const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);

  await browser.waitUntilDisplayed(secondRunnerSO.sbkBetButtons[0], "Second bet button is not visible");
  await mockService.mockHttpRequest(getImplyBetsResponse(TWO_SINGLE_MOCK));
  await secondRunnerSO.sbkBetButtons[0].click();

  const thirdCardSO = new CardSO(loadedGenericScreenSO.cards[2]);
  const thirdSportsbookMarketSO = new SportsbookMarketSO(thirdCardSO.sportsbookMarket);
  const thirdRunnerSO = new RunnerSO(thirdSportsbookMarketSO.runnerList[0]);

  await browser.waitUntilDisplayed(thirdRunnerSO.sbkBetButtons[0], "Third bet button is not visible");
  await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_SGM_MOCK));
  await thirdRunnerSO.sbkBetButtons[0].click();

  await browser.waitUntilClickableNative(minimizedSO.element);
  await minimizedSO.element.click();
  await browser.waitUntilDisplayed(placePanelSO.element);

  // set stake
  await firstStakeSO.setValue(1);
  await hideKeyboard();

  // place bet
  await browser.waitUntilClickableNative(placeButtonSO.element);
  await placeButtonSO.element.click();
};

describe("Bet Builders - Betreceipt Notifications", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getNSSRegister());
    await mockService.mockHttpRequest(getNSSSubscribeUnavailable(NSS_BETBUILDER_MOCK));

    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_SGM_MOVEMENT_MOCK));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));

    const HOME_VIEW_LINK = getStartViewLink(`football/portugal/liga/e-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when there is a Treble Bet Builder in the betslip", () => {
    describe("When user places a bet", () => {
      beforeAll(async () => {
        await placeBetBuilderBet();
      });

      it("[PRPI-3285] The toggle should be displayed with correct content", async () => {
        expect(await optionSO.title.getText()).toBe("Receive Live Alerts");
        expect(await optionSO.toggle.isDisplayed()).toBe(true);
        expect(await switchSO.switch.getAttribute("selected")).toBe("false");
      });

      it("[PRPI-3286] Shouldn't show the notification unavailable icon in BetSummary", async () => {
        expect(await betBuildersSummarySO.notificationsUnavailableIcon.isDisplayed()).toBe(false);
      });

      describe("When the user turns notifications on for one bet builder event without notifications supported", () => {
        beforeAll(async () => {
          await togglePush();
        });

        it("[PRPI-3287] The toggle should not be displayed", async () => {
          expect(await optionSO.toggle.isExisting()).toBe(false);
        });

        it("[PRPI-3288] Should show the notification unavailable icon in BetSummary", async () => {
          expect(await betBuildersSummarySO.notificationsUnavailableIcon.isDisplayed()).toBe(true);
        });
      });

      describe("When the user closes the bet receipt and places a bet again on the same events", () => {
        beforeAll(async () => {
          await receiptTitleSO.dismissButton.click();
          await placeBetBuilderBet();
        });

        it("[PRPI-3289] The toggle should not be displayed", async () => {
          expect(await optionSO.toggle.isExisting()).toBe(false);
        });

        it("[PRPI-3290] Should show the notification unavailable icon in BetSummary", async () => {
          expect(await betBuildersSummarySO.notificationsUnavailableIcon.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
