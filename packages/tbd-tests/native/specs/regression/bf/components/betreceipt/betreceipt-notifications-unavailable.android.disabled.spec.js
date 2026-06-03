import { getAppContext } from "@ppb/tbd-shared/mocks/bff/bff.controller";

const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getNSSRegister, getNSSSubscribeUnavailable } = require("@ppb/tbd-shared/mocks/nss/nss.controller");
const { swipeUp, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  CardSO,
  BetslipDrawerSO,
  SportsbookMarketSO,
  RunnerSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  ReceiptTitleSO,
  SwitchSO,
  OptionSO,
  SnackbarSO,
  BetSelectionsSO,
  BetSelectionDetailsSO,
  GenericScreenSO,
  MultiplesCardSO,
  MinimizedSO,
  SportsbookPlacePanelSO,
  SportsbookReceiptPanelSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();

// place screen objects
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.element);
const multipleControlsSO = new BetControlsSO(multiplesCardSO.element);
const multipleStakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);

const multiplesSelectionsSO = new BetSelectionsSO();
const firstBetSelectionSO = new BetSelectionDetailsSO(multiplesSelectionsSO.selections[0]);
const secondBetSelectionSO = new BetSelectionDetailsSO(multiplesSelectionsSO.selections[1]);

// receipt screen objects
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const receiptTitleSO = new ReceiptTitleSO();
const optionSO = new OptionSO(sportsbookReceiptPanelSO.element);
const switchSO = new SwitchSO(optionSO.toggle);

const snackbarSO = new SnackbarSO();

const placeDoubleBet = async () => {
  // Fist selection
  await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
  await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
  await firstRunnerSO.sbkBetButtons[0].click();
  await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for Sportsbook single place panel element");

  // Second Selection
  await browser.waitUntilClickableNative(betslipDrawerSO.header);
  await betslipDrawerSO.header.click();
  await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");
  await swipeUp(0.5); // swipe to the bottom of the screen to reveal last card
  await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
  await browser.waitUntilClickableNative(secondRunnerSO.sbkBetButtons[0]);
  await secondRunnerSO.sbkBetButtons[0].click();

  await browser.waitUntilEquals(minimizedSO.counter, "2");
  await browser.waitUntilClickableNative(minimizedSO.element);
  await minimizedSO.element.click();

  // multiples stake
  await browser.waitUntilDisplayed(multipleStakeInputFieldSO.element, "Waiting for multiple stake input field");
  await multipleStakeInputFieldSO.numberField.setValue(0.1);
  await hideKeyboard();

  // place bet
  await mockService.mockHttpRequest(getPlaceBet(PLACE_SUCCESS));
  await browser.waitUntilClickableNative(placeButtonSO.element);
  await placeButtonSO.element.click();
  await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for Sportsbook confirm panel");
};

const togglePush = async () => {
  await browser.waitUntilDisplayed(switchSO.switch);
  await browser.waitUntilClickableNative(switchSO.switch);
  await switchSO.switch.click();
  await optionSO.toggle.waitForDisplayed({ reverse: true });
  await browser.waitUntilDisplayed(snackbarSO.element);
};

const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 31947807;
const FIRST_MARKET_ID = "924.337797045";
const SECOND_EVENT_ID = 31951634;
const SECOND_MARKET_ID = "924.338039536";
const THIRD_MARKET_ID = "924.3";

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
                    name: "Portugal",
                  },
                  away: {
                    name: "Switzerland",
                  },
                },
                sportevent: {
                  name: "Portugal v Switzerland",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${FIRST_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "World Cup",
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
                          name: "Portugal v Switzerland",
                          urn: `ppb:event:${FIRST_EVENT_ID}`,
                          eventId: FIRST_EVENT_ID,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/19`,
                          selectionId: 19,
                          name: "Portugal",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/15193`,
                          selectionId: 15193,
                          name: "Switzerland",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/19`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/15193`,
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
                    name: "Netherlands",
                  },
                  away: {
                    name: "Argentina",
                  },
                },
                sportevent: {
                  name: "Netherlands v Argentina V3",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${SECOND_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "World Cup",
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
                          name: "Netherlands v Argentina",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                          eventId: SECOND_EVENT_ID,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/27`,
                          selectionId: 27,
                          name: "Netherlands",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/24`,
                          selectionId: 24,
                          name: "Argentina",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/27`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/24`,
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
          selectionId: 19,
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
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: 27,
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
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 19,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 27,
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

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.1,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.23,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.23 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const PLACE_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 1.23 },
      },
      betType: "DOUBLE",
      runners: [
        {
          runner: { marketId: FIRST_MARKET_ID, selectionId: 19 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          runner: { marketId: SECOND_MARKET_ID, selectionId: 27 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: FIRST_MARKET_ID, selectionId: 19 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: SECOND_MARKET_ID, selectionId: 27 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalStake: 0.1,
      totalPotentialWin: 0.12,
    },
  ],
};

const NSS_MOCK = {
  topics: [
    {
      topicId: FIRST_EVENT_ID,
      eventType: "FOOTBALL",
      incidentTypes: [
        "FOOTBALL_KICK_OFF",
        "FOOTBALL_HALF_TIME",
        "FOOTBALL_FINAL_SCORE",
        "FOOTBALL_RED_CARD",
        "FOOTBALL_SCORE_CHANGE",
      ],
    },
    {
      topicId: SECOND_EVENT_ID,
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

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "19",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.9 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.9 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "15193",
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "27",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
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
          selectionId: "24",
          noOdds: true,
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
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

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

describe("Betreceipt Notifications", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getNSSRegister());
    await mockService.mockHttpRequest(getNSSSubscribeUnavailable(NSS_MOCK));

    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("When the user places a bet on 3 events, with notifications unavailable", () => {
    beforeAll(async () => {
      await placeDoubleBet();
      await browser.waitUntil(async () => (await switchSO.switch.getAttribute("selected")) === "false");
    });

    it("[PRPI-3268] The toggle should be displayed disabled", async () => {
      expect(await optionSO.toggle.isDisplayed()).toBe(true);
      expect(await switchSO.switch.getAttribute("selected")).toBe("false");
      expect(await optionSO.title.getText()).toBe("Receive Live Alerts");
    });

    it("[PRPI-3269] Shouldn't show the notification unavailable icon in BetSelectionDetails", async () => {
      expect(await firstBetSelectionSO.notificationsUnavblIcon.isDisplayed()).toBe(false);
      expect(await secondBetSelectionSO.notificationsUnavblIcon.isDisplayed()).toBe(false);
    });

    describe("When the user turns notifications on for two events without notifications supported", () => {
      beforeAll(async () => {
        await togglePush();
      });

      it("[PRPI-3270] The toggle should not be displayed", async () => {
        expect(await optionSO.toggle.isExisting()).toBe(false);
      });

      it("[PRPI-3271] The toast message should be displayed", async () => {
        expect(await snackbarSO.icon.isDisplayed()).toBe(true);
        expect(await snackbarSO.title.getText()).toBe("There are no notifications available.");
      });

      it("[PRPI-3272] Should show the notification unavailable icon in BetSelectionDetails", async () => {
        expect(await firstBetSelectionSO.notificationsUnavblIcon.isDisplayed()).toBe(true);
        expect(await secondBetSelectionSO.notificationsUnavblIcon.isDisplayed()).toBe(true);
      });

      describe("When the user closes the bet receipt and places a bet again on the same events", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(receiptTitleSO.dismissButton);
          await receiptTitleSO.dismissButton.click();
          await placeDoubleBet();
        });

        it("[PRPI-3273] The toggle should not be displayed", async () => {
          expect(await optionSO.toggle.isExisting()).toBe(false);
        });

        it("[PRPI-3273] Should show the notification unavailable icon in BetSelectionDetails", async () => {
          expect(await firstBetSelectionSO.notificationsUnavblIcon.isDisplayed()).toBe(true);
          expect(await secondBetSelectionSO.notificationsUnavblIcon.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
