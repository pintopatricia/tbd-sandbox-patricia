const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
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
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  BetSportsbookReceiptSO,
  GenericScreenSO,
  SingleSO,
  SinglesCardSO,
  PrimaryButtonSO,
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  CurrencyNumberInputFieldSO,
  OptionSO,
  BetControlsSO,
  FreeBetsSO,
  BetsSummarySO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const cardSO = new CardSO(genericScreenSO.element);
const sportsbookMarketSO = new InlineSportsbookMarketSO(cardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(sportsbookMarketSO.sbkBetButtons[0]);
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const placeButtonSO = new PrimaryButtonSO();
const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const singleSO = new SingleSO(singlesCardSO.singles[0]);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const singleInputFieldSO = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);
const singleBetsSummarySO = new BetsSummarySO(sportsbookPlacePanelSO.element);
const betSportsbookReceiptSO = new BetSportsbookReceiptSO();
const receiptBetsSummarySO = new BetsSummarySO(betSportsbookReceiptSO.element);
const freeBetsSO = new FreeBetsSO();
const receiptFreeBetsSO = new OptionSO(betSportsbookReceiptSO.element);
const optionSO = new OptionSO(sportsbookPlacePanelSO.element);

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
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
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
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
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

      wallets: [{ amount: 0.1, nonRedeemableAmount: 0.1, type: "BONUS_CASH" }],
      totalStake: 0.1,
      totalPotentialWin: 0.55,
    },
  ],
};
const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: 48044,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.1,
  betMaxStake: 1000,
  averageOdds: 6.5,
  winAverageOdds: 6.5,
  betMinStakeIncrement: 0.01,
  bonusWalletConditions: [{ value: 0.55, type: "NON_REDEEMABLE_AMOUNT" }],
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 48044,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
    decimalDisplayOdds: { decimalOdds: 6.5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};
const IMPLY_BET_SERVICE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
  hasBonusMoney: true,
};

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

describe("Betslip - SBK Single Bet Placement", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_BET_SERVICE_MOCK));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
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
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );
    });

    it("[PRPI-3521] The betslip should display with freebets component", async () => {
      expect(await freeBetsSO.element.isDisplayed()).toBe(true);
      expect(await optionSO.checkbox.getAttribute("selected")).toBe("false");
    });

    describe("And when the user sets a stake value", () => {
      beforeAll(async () => {
        await singleInputFieldSO.numberField.setValue(0.1);
        await hideKeyboard();
        await browser.waitUntilEquals(singleBetsSummarySO.totalReturnsValue, "$0.65");
      });

      it("[PRPI-3522] The returns should be displayed", async () => {
        expect(await singleBetsSummarySO.totalReturnsValue.getText()).toBe("$0.65");
      });

      it("[PRPI-4131] should display 'Balance After Bet' with the correct value", async () => {
        expect(await singleBetsSummarySO.leftSegmentLabel.getText()).toBe("Balance After Bet");
        expect(await singleBetsSummarySO.leftSegmentValue.getText()).toBe("$122.90");
      });

      describe("And when the user clicks on freebets checkbox", () => {
        beforeAll(async () => {
          await optionSO.checkbox.click();
          await browser.waitUntil(async () => (await optionSO.checkbox.getAttribute("selected")) === "true");
        });

        it("[PRPI-3523] The checkbox should be selected", async () => {
          expect(await optionSO.checkbox.getAttribute("selected")).toBe("true");
        });

        it("[PRPI-3524] The returns should change", async () => {
          expect(await singleBetsSummarySO.totalReturnsValue.getText()).toEqual("$0.55");
        });

        it("[PRPI-4132] should display 'Balance After Bet' with 'N/A'", async () => {
          expect(await singleBetsSummarySO.leftSegmentValue.getText()).toBe("N/A");
        });

        describe("And when the user taps place bet button", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(placeButtonSO.element);
            await placeButtonSO.element.click();
            await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Receipt panel was not displayed");
          });

          it("[PRPI-3525] The free bets 'Using \u20AC0.10 Free Bet' text should be displayed", async () => {
            expect(await receiptFreeBetsSO.title.getText()).toEqual("Used $0.10 Free Bet");
          });

          it("[PRPI-3526] The returns should be the updated value", async () => {
            expect(await receiptBetsSummarySO.totalReturnsValue.getText()).toEqual("$0.55");
          });
        });
      });
    });
  });
});
