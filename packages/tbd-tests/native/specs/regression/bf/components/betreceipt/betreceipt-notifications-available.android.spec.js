const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getNSSRegister, getNSSSubscribeSuccess } = require("@ppb/tbd-shared/mocks/nss/nss.controller");
const { swipeUp, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  GenericScreenSO,
  MultiplesCardSO,
  CardSO,
  BetslipDrawerSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  ReceiptTitleSO,
  SwitchSO,
  OptionSO,
  SnackbarSO,
  MinimizedSO,
  SportsbookPlacePanelSO,
  SportsbookReceiptPanelSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const secondSportsbookMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const secondRunnerSO = new SportsbookBetButtonSO(secondSportsbookMarketSO.sbkBetButtons[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();

// place screen objects
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.element);
const multipleControlsSO = new BetControlsSO(multiplesCardSO.element);
const multipleStakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const placeButtonSO = new PrimaryButtonSO();

// receipt screen objects
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const receiptTitleSO = new ReceiptTitleSO();
const optionSO = new OptionSO(sportsbookReceiptPanelSO.element);
const switchSO = new SwitchSO();

const snackbarSO = new SnackbarSO();

const placeDoubleBet = async () => {
  // Fist selection
  await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
  await browser.waitUntilClickableNative(firstRunnerSO.element);
  await firstRunnerSO.element.click();
  await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for Sportsbook single place panel element");

  // Second Selection
  await browser.waitUntilClickableNative(betslipDrawerSO.header);
  await betslipDrawerSO.header.click();
  await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");
  await swipeUp(0.5); // swipe to the bottom of the screen to reveal last card
  await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
  await browser.waitUntilClickableNative(secondRunnerSO.element);
  await secondRunnerSO.element.click();

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

const togglePush = async (subscribeStatus) => {
  await browser.waitUntilDisplayed(switchSO.element);
  await browser.waitUntilClickableNative(switchSO.element);
  await switchSO.element.click();
  await browser.waitUntil(async () => (await switchSO.element.getAttribute("selected")) === subscribeStatus, {
    timeoutMsg: "failed to switch on",
  });
  await browser.waitUntilDisplayed(snackbarSO.element, { timeoutMsg: "waiting until snackbarSO displayed" });
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
    await mockService.mockHttpRequest(getNSSSubscribeSuccess(NSS_MOCK));

    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("When the user places a bet on 3 events, all with notifications", () => {
    beforeAll(async () => {
      await placeDoubleBet();
      await browser.waitUntil(async () => (await switchSO.element.getAttribute("selected")) === "false");
    });

    it("[PRPI-3260] The toggle should be displayed disabled", async () => {
      expect(await optionSO.toggle.isDisplayed()).toBe(true);
      expect(await switchSO.element.getAttribute("selected")).toBe("false");
      expect(await optionSO.title.getText()).toBe("Receive Live Alerts");
    });

    describe("When the user turns notifications on, for 2 events with notifications supported", () => {
      beforeAll(async () => {
        await togglePush("true");
      });

      it("[PRPI-3261] The toggle should be displayed enabled", async () => {
        expect(await optionSO.toggle.isDisplayed()).toBe(true);
        expect(await switchSO.element.getAttribute("selected")).toBe("true");
      });

      it("[PRPI-3262] The toast message should be displayed", async () => {
        expect(await snackbarSO.icon.isDisplayed()).toBe(true);
        expect(await snackbarSO.title.getText()).toBe("Enabled Live Alerts");
        expect(await snackbarSO.description.getText()).toBe("You’ve chosen to receive notifications.");
      });

      describe("When the user closes the bet receipt and places a bet again on the same events", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(receiptTitleSO.dismissButton);
          await receiptTitleSO.dismissButton.click();
          await placeDoubleBet();
          await browser.waitUntil(async () => (await switchSO.element.getAttribute("selected")) === "true");
        });

        it("[PRPI-3263] The toggle should be displayed enabled", async () => {
          expect(await optionSO.toggle.isDisplayed()).toBe(true);
          expect(await switchSO.element.getAttribute("selected")).toBe("true");
        });

        describe("And when the user disables the push notifications", () => {
          beforeAll(async () => {
            await togglePush("false");
          });

          it("[PRPI-3263] The toast message should be displayed", async () => {
            expect(await snackbarSO.icon.isDisplayed()).toBe(true);
            expect(await snackbarSO.title.getText()).toBe("Disabled Live Alerts");
            expect(await snackbarSO.description.getText()).toBe("You’ve chosen not to receive notifications.");
          });

          it("[PRPI-3263] The toggle should be disabled", async () => {
            expect(await switchSO.element.getAttribute("selected")).toBe("false");
          });
        });
      });
    });
  });
});
