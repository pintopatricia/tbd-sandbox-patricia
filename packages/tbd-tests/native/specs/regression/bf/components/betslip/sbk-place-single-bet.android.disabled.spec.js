const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
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
      },
      runners: [
        {
          runner: { marketId: MARKET_ID, selectionId: 48044 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
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
          },
        },
      ],

      totalPotentialWin: 2,
    },
  ],
};

describe("Betslip - SBK Single Bet Placement", () => {
  beforeAll(async () => {
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

    it("[PRPI-3527] should show the place panel header", async () => {
      expect(await betslipDrawerSO.header.isDisplayed()).toBe(true);
    });

    it("[PRPI-3528] should show the selection title", async () => {
      expect(await betDetailsSO.title.getText()).toBe("Sporting");
    });

    it("[PRPI-3529] should show the selection subtitle", async () => {
      expect(await betDetailsSO.subtitle.getText()).toBe("Match Odds - Sporting v Man Utd");
    });

    it("[PRPI-3530] should show the trash icon", async () => {
      expect(await betDetailsSO.remove.isDisplayed()).toBe(true);
    });

    it("[PRPI-3531] should show the price field with populated value", async () => {
      expect(await sportsbookSinglePlacePriceInputField.numberField.getValue()).toBe("6.5");
    });

    it("[PRPI-3532] should show an empty size field", async () => {
      // "Stake" placeholder is always visible
      expect(await sportsbookSinglePlaceSizeInputField.numberField.getText()).toBe("");
    });

    describe("when the user sets a stake value", () => {
      beforeAll(async () => {
        await sportsbookSinglePlaceSizeInputField.numberField.setValue(0.1);
        await browser.waitUntilEquals(sportsbookSinglePlaceSizeInputField.numberField, "0.1");
        await hideKeyboard();
      });

      it("[PRPI-3533] should show the currency symbol in the size input field", async () => {
        expect(await sportsbookSinglePlaceSizeInputField.currencySymbol.getText()).toBe("$");
      });

      it("[PRPI-3534] should show the returns", async () => {
        expect(await singleControlsSO.returns.getText()).toBe("Returns $0.65");
      });

      describe("when the user taps the place button", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
          await sportsbookSinglePlacePanelSO.placeBtn.click();
          await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for receipt panel element");
        });

        it("[PRPI-3535] should show the 'Bet Placed' title", async () => {
          expect(await receiptTitleSO.label.getText()).toBe("Bet Placed");
        });

        it("[PRPI-3536] should show the dismiss button", async () => {
          expect(await receiptTitleSO.dismissButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-3537] should show the selection title", async () => {
          expect(await betDetailsSO.title.getText()).toBe("Sporting");
        });

        it("[PRPI-3538] should show the selection subtitle", async () => {
          expect(await betDetailsSO.subtitle.getText()).toBe("Match Odds - Sporting v Man Utd");
        });

        describe("when the user taps the done button", () => {
          beforeAll(async () => {
            await receiptTitleSO.dismissButton.click();
            await browser.waitUntilNotDisplayed(betslipDrawerSO.header, "Betslip is visible");
          });

          it("[PRPI-3539] should close betslip", async () => {
            expect(await betslipDrawerSO.header.isDisplayed()).toBe(false);
          });
        });
      });
    });
  });
});
