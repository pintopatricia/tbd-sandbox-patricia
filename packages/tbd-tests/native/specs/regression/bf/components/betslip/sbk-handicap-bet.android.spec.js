const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  SingleSO,
  PrimaryButtonSO,
  SportsbookMarketSO,
  CardSO,
  RunnerSO,
  CurrencyNumberInputFieldSO,
  BetDetailsSO,
  AlertSO,
  BetControlsSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const cardSO = new CardSO(genericScreenSO.element);
const sportsbookMarketSO = new SportsbookMarketSO(cardSO.element);
const firstRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[0]);
const sportsbookSinglePlacePanelSO = new SportsbookPlacePanelSO();
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const betDetailsSO = new BetDetailsSO();
const placeButtonSO = new PrimaryButtonSO();
const firstSingleSO = new SingleSO(sportsbookSinglePlacePanelSO.element);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const sportsbookSinglePlaceSizeInputField = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);

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
              fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: 2.0,
        },
        {
          selectionId: 58805,
          noOdds: true,
          handicap: -2.0,
        },
        {
          selectionId: 48351,
          noOdds: true,
          handicap: -2.0,
        },
      ],
    },
  ],
};

const SMP_MOCK_HANDICAP_UPDATE = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 6.5 },
              fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: -2.0,
        },
        {
          selectionId: 58805,
          noOdds: true,
          handicap: -2.0,
        },
        {
          selectionId: 48351,
          noOdds: true,
          handicap: -2.0,
        },
      ],
    },
  ],
};

const SMP_MOCK_MOVEMENT_UPDATE = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.3 },
              fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: -2.0,
        },
        {
          selectionId: 58805,
          noOdds: true,
          handicap: -2.0,
        },
        {
          selectionId: 48351,
          noOdds: true,
          handicap: -2.0,
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
        cardGroupTitle: "Handicap Markets",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${EVENT_ID}`,
                cardTitle: "Alternative Handicaps",
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Villarreal",
                  },
                  away: {
                    name: "Arsenal",
                  },
                },
                marketsHierarchy: {
                  __typename: "EventHierarchy",
                  sportevent: {
                    name: "Villarreal v Arsenal",
                    urn: `ppb:event:${EVENT_ID}`,
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
                      noLiveData: true,
                      name: "Alternative Handicaps",
                      marketType: "MATCH_HANDICAP_WITH_TIE",
                      marketTypeName: null,
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Villarreal v Arsenal",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Villarreal",
                          handicap: "2",
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805-2`,
                          selectionId: 58805,
                          name: "Handicap Draw",
                          handicap: "-2",
                          resultType: "LINE",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351-2`,
                          selectionId: 48351,
                          name: "Arsenal",
                          handicap: 2,
                          resultType: "AWAY",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805-2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351-2`,
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
            betRunners: [{ runner: { marketId: MARKET_ID, selectionId: 48044, handicap: -2 } }],
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

const SIB_SINGLE_MOCK = {
  betCombinations: [
    {
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

      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: MARKET_ID,
        selectionId: 48044,
        handicap: 2,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 6.5 },
        },
        decimalDisplayOdds: {
          decimalOdds: 6.5,
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],
};

const SIB_SINGLE_MOCK_HANDICAP_UPDATE = {
  betCombinations: [
    {
      ...SIB_SINGLE_MOCK.betCombinations[0],
    },
  ],

  runnerOdds: [
    {
      ...SIB_SINGLE_MOCK.runnerOdds[0],
      runner: {
        marketId: MARKET_ID,
        selectionId: 48044,
        handicap: -2,
      },
    },
  ],
};

const SIB_SINGLE_ODDS_MOVEMENT_MOCK = {
  betCombinations: [
    {
      ...SIB_SINGLE_MOCK_HANDICAP_UPDATE.betCombinations[0],
      averageOdds: 2.1,
      winAverageOdds: 2.1,
      betMinStakeIncrement: 0.01,
    },
  ],

  runnerOdds: [
    {
      ...SIB_SINGLE_MOCK_HANDICAP_UPDATE.runnerOdds[0],
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 2.3 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.3,
        },
        fractionalDisplayOdds: { numerator: 13, denominator: 10 },
      },
    },
  ],
};

describe("SBK: Handicap Bet Details", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(firstRunnerSO.element);
  });

  describe("When user clicks on the bet button of the first runner", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilEquals(betDetailsSO.title, "Villarreal");
    });

    it("[PRPI-3380] Should show the correct runner name with the correct handicap", async () => {
      expect(await betDetailsSO.title.getText()).toBe("Villarreal");
      expect(await betDetailsSO.titleHighlight.getText()).toBe(" (+2)");
    });

    it("[PRPI-3381] Should show the correct market name", async () => {
      expect(await betDetailsSO.subtitle.getText()).toBe("Alternative Handicaps - Villarreal v Arsenal");
    });

    it("[PRPI-3382] Should show the trash bin icon", async () => {
      expect(await betDetailsSO.remove.isDisplayed()).toBe(true);
    });

    describe("When the handicap value gets updated", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK_HANDICAP_UPDATE));
        await mockService.mockHttpRequest(
          getMarketPrices(SMP_MOCK_HANDICAP_UPDATE, { ignoreRequestedMarketIdsMatch: true }),
        );
        const alertSO = new AlertSO();

        await browser.waitUntilEquals(alertSO.message, "The Handicap has changed");
        await browser.waitUntilEquals(betDetailsSO.titleHighlight, " (-2)");
      });

      it("[PRPI-3383] Should show the correct runner name with the updated handicap", async () => {
        expect(await betDetailsSO.title.getText()).toBe("Villarreal");
        expect(await betDetailsSO.titleHighlight.getText()).toBe(" (-2)");
      });

      it("[PRPI-3384] Should show warning message about the updated handicap", async () => {
        const alertSO = new AlertSO();

        expect(await alertSO.message.getText()).toBe("The Handicap has changed");
      });

      it("[PRPI-3385] The place button should show the text 'Please Enter Stake'", async () => {
        expect(await placeButtonSO.label.getText()).toBe("Please Enter Stake");
      });

      describe("When the odds value change", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_MOVEMENT_UPDATE, { ignoreRequestedMarketIdsMatch: true }),
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_ODDS_MOVEMENT_MOCK));

          const alertSO = new AlertSO(sportsbookSinglePlacePanelSO.element);
          await browser.waitUntilEquals(alertSO.message, "The Odds and Handicap have changed");
        });

        it("[PRPI-3386] Should show warning message about the updated handicap and the changed odds", async () => {
          const alertSO = new AlertSO(sportsbookSinglePlacePanelSO.element);

          expect(await alertSO.message.getText()).toBe("The Odds and Handicap have changed");
        });

        it("[PRPI-3387] The place button should show the text 'Please Enter Stake'", async () => {
          expect(await placeButtonSO.label.getText()).toBe("Please Enter Stake");
        });

        describe("When user clicks on the place button and the receipt panel is shown", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
            await sportsbookSinglePlaceSizeInputField.numberField.click();
            await sportsbookSinglePlaceSizeInputField.numberField.setValue(2);
            await browser.waitUntilEquals(sportsbookSinglePlaceSizeInputField.numberField, "2");
            await placeButtonSO.element.click();
            await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for receipt panel element");
          });

          it("[PRPI-3388] Should show the correct runner name with the correct handicap", async () => {
            expect(await betDetailsSO.title.getText()).toBe("Villarreal (-2)");
          });

          it("[PRPI-3388] Should show the correct market name", async () => {
            expect(await betDetailsSO.subtitle.getText()).toBe("Alternative Handicaps - Villarreal v Arsenal");
          });
        });
      });
    });
  });
});
