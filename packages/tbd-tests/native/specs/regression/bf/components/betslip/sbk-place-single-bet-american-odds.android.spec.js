const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  SportsbookReceiptPanelSO,
  GenericScreenSO,
  SportsbookPlacePanelSO,
  SingleSO,
  BetslipDrawerSO,
  ReceiptTitleSO,
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  FixedNumberInputFieldSO,
  CurrencyNumberInputFieldSO,
  BetDetailsSO,
  BetControlsSO,
  BetSegmentsSO,
  SelectionSegmentSO,
  OddsSO,
  PNLAndWhatIfSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const cardSO = new CardSO(genericScreenSO.element);
const sportsbookMarketSO = new InlineSportsbookMarketSO(cardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(sportsbookMarketSO.sbkBetButtons[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const sportsbookSinglePlacePanelSO = new SportsbookPlacePanelSO();

const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();

const betDetailsSO = new BetDetailsSO();
const receiptTitleSO = new ReceiptTitleSO();

const firstSingleSegmentsSO = new BetSegmentsSO();
const firstSingleSelectionSegmentSO = new SelectionSegmentSO(firstSingleSegmentsSO.leftSegment);
const thirdSingleSelectionSegmentSO = new SelectionSegmentSO(firstSingleSegmentsSO.rightSegment);
const firstSingleBetSegmentOddsSO = new OddsSO(firstSingleSelectionSegmentSO.element);
const thirdSingleBetSegmentReturnsSO = new PNLAndWhatIfSO(thirdSingleSelectionSegmentSO.element);

const singleSO = new SingleSO(sportsbookSinglePlacePanelSO.element);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const sportsbookSinglePlacePriceInputField = new FixedNumberInputFieldSO(singleControlsSO.fixedInput);

const sportsbookSinglePlaceSizeInputField = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;
const MARKET_ID = "924.193270252";

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 6.5 },
            },
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            americanDisplayOdds: { americanOdds: 550.0, americanOddsInt: 550 },
          },
        },
        {
          selectionId: 58805,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            americanDisplayOdds: { americanOdds: -500.0, americanOddsInt: -500 },
          },
        },
        {
          selectionId: 48351,
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
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
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
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
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
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
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
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
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
  ],
};

const SPB_MOCK_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 6.5 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
        americanDisplayOdds: { americanOdds: 550.0, americanOddsInt: 550 },
      },
      runners: [
        {
          runner: { marketId: MARKET_ID, selectionId: 48044 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            americanDisplayOdds: { americanOdds: 550.0, americanOddsInt: 550 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: MARKET_ID, selectionId: 48044 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            americanDisplayOdds: { americanOdds: 550.0, americanOddsInt: 550 },
          },
        },
      ],

      totalPotentialWin: 2,
    },
  ],
};

const BFF_APP_CONTEXT_MOCK = {
  sportsbookOddsDisplay: "AMERICAN",
};

describe("Betslip - SBK Single Bet Placement", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(BFF_APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when the user taps on a given bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(
        sportsbookSinglePlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );
    });

    it("[PRPI-4120] should show the place panel header", async () => {
      expect(await betslipDrawerSO.header.isDisplayed()).toBe(true);
    });

    it("[PRPI-4121] should show the selection title", async () => {
      expect(await betDetailsSO.title.getText()).toBe("Sporting");
    });

    it("[PRPI-4122] should show the selection subtitle", async () => {
      expect(await betDetailsSO.subtitle.getText()).toBe("Match Odds - Sporting v Man Utd");
    });

    it("[PRPI-4123] should show the trash icon", async () => {
      expect(await betDetailsSO.remove.isDisplayed()).toBe(true);
    });

    it("[PRPI-4124] should show the price field with populated value", async () => {
      expect(await sportsbookSinglePlacePriceInputField.numberField.getText()).toBe("+550");
    });

    it("[PRPI-4125] should show an empty size field", async () => {
      // "Stake" placeholder is always visible
      expect(await sportsbookSinglePlaceSizeInputField.numberField.getText()).toBe("");
    });

    describe("when the user sets a stake value", () => {
      beforeAll(async () => {
        await sportsbookSinglePlaceSizeInputField.numberField.setValue(0.1);
        await browser.waitUntilEquals(sportsbookSinglePlaceSizeInputField.numberField, "0.1");
        await hideKeyboard();
      });

      describe("and the user taps the place button", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
          await sportsbookSinglePlacePanelSO.place.click();
          await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for receipt panel element");
        });

        it("[PRPI-4126] should show the 'Bet Placed' title", async () => {
          expect(await receiptTitleSO.label.getText()).toBe("Bet Placed");
        });

        it("[PRPI-4127] should show the placed selection bet details", async () => {
          expect(await firstSingleSelectionSegmentSO.term.getText()).toBe("Odds");
          expect(await thirdSingleSelectionSegmentSO.term.getText()).toBe("Returns");
          expect(await firstSingleBetSegmentOddsSO.odds.getText()).toBe("+550");
          expect(await thirdSingleBetSegmentReturnsSO.pnl.getText()).toBe("$2.00");
        });

        it("[PRPI-4128] should show the dismiss button", async () => {
          expect(await receiptTitleSO.dismissButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-4129] should show the selection title", async () => {
          expect(await betDetailsSO.title.getText()).toBe("Sporting");
        });

        it("[PRPI-4130] should show the selection subtitle", async () => {
          expect(await betDetailsSO.subtitle.getText()).toBe("Match Odds - Sporting v Man Utd");
        });
      });
    });
  });
});
