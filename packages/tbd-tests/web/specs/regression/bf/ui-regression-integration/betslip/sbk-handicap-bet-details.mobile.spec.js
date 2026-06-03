const {
  AppPO,
  SportsbookReceiptPanelPO,
  MarketPagePO,
  SportsbookPlacePanelPO,
  RunnerPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  BetDetailsPO,
  PrimaryButtonPO,
  AlertPO,
  CurrencyNumberInputFieldPO,
  BetControlsPO,
  BetslipDrawerPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const marketPagePO = new MarketPagePO();
const sportsbookMarketPO = new SportsbookMarketPO(marketPagePO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const firstRunnerBetButtonPO = new SportsbookBetButtonPO(firstRunnerPO.sportsbookBetButton);
const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(placePanelPO.element);
const betDetailsPO = new BetDetailsPO(placePanelPO.element);
const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);
const betslipDrawerPO = new BetslipDrawerPO();
const receiptPanelPO = new SportsbookReceiptPanelPO();
const receiptBetDetailsPO = new BetDetailsPO(receiptPanelPO.element);
const alertPO = new AlertPO(placePanelPO.element);
const stakeFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);

const mockService = new MockService();

const FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:30431869|viewLink",
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:30431869",
      name: "Villarreal v Arsenal",
    },
    fixture: {
      urn: "ppb:fixture:30431869",
      home: {
        name: "Villarreal",
      },
      away: {
        name: "Arsenal",
      },
    },
  },
};

const SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.26098",
  name: "Alternative Handicaps",
  marketType: "MATCH_HANDICAP_WITH_TIE",
  marketTypeName: null,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:30431869",
      name: "Villarreal v Arsenal",
    },
  },
  runners: [
    {
      __typename: "Runner",
      runnerURN: "ppb:sbkRunner:924.26098/28191",
      name: "Villarreal",
      selectionId: 28191,
      handicap: "-2",
      resultType: "HOME",
    },
    {
      __typename: "Runner",
      runnerURN: "ppb:sbkRunner:924.26098/12453909",
      name: "Handicap Draw",
      selectionId: 12453909,
      handicap: "-2",
      resultType: "LINE",
    },
    {
      __typename: "Runner",
      runnerURN: "ppb:sbkRunner:924.26098/1096",
      name: "Arsenal",
      selectionId: 1096,
      handicap: 2,
      resultType: "AWAY",
    },
  ],
};

const MARKET_EXTENDED_CARD = {
  node: {
    __typename: "MarketExtendedCard",
    urn: "ppb:tbd:card:marketExtended:924.26098|false",
    cardTitle: "Alternative Handicaps",
    displayRunners: {
      exchange: null,
      sportsbook: {
        market: SPORTSBOOK_MARKET,
        runners: [
          {
            runnerURN: "ppb:sbkRunner:924.26098/28191",
          },
          {
            runnerURN: "ppb:sbkRunner:924.26098/12453909",
          },
          {
            runnerURN: "ppb:sbkRunner:924.26098/1096",
          },
        ],
      },
    },
    cashoutQuotes: null,
  },
};

const BFF_MARKET_VIEW_MOCK = {
  __typename: "MarketView",
  urn: "ppb:tbd:view:market:924.26098",
  url: "football/uefa-europa-league/villarreal-v-arsenal/alternative-handicaps/r-924.26098",
  mainMarket: SPORTSBOOK_MARKET,
  edges: [FIXTURE, MARKET_EXTENDED_CARD],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.26098",
      runnerDetails: [
        {
          selectionId: 28191,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 13.0 },
              fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            },
            decimalDisplayOdds: {
              decimalOdds: 13.0,
            },
            fractionalDisplayOdds: {
              numerator: 1,
              denominator: 2,
            },
          },
          handicap: -2.0,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 12453909,
          noOdds: true,
          handicap: -2.0,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 1096,
          noOdds: true,
          handicap: 2.0,
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

const SMP_MOCK_UPDATE_HANDICAP = {
  markets: [
    {
      marketId: "924.26098",
      runnerDetails: [
        {
          selectionId: 28191,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 13.0 },
              fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            },
            decimalDisplayOdds: {
              decimalOdds: 13.0,
            },
            fractionalDisplayOdds: {
              numerator: 1,
              denominator: 2,
            },
          },
          handicap: 2.0,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 12453909,
          noOdds: true,
          handicap: -2.0,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 1096,
          noOdds: true,
          handicap: 2.0,
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

const SMP_MOCK_UPDATE_ODDS = {
  markets: [
    {
      marketId: "924.26098",
      runnerDetails: [
        {
          selectionId: 28191,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.3 },
              fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            },
            decimalDisplayOdds: {
              decimalOdds: 2.3,
            },
            fractionalDisplayOdds: {
              numerator: 1,
              denominator: 2,
            },
          },
          handicap: 2.0,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 12453909,
          noOdds: true,
          handicap: -2.0,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 1096,
          noOdds: true,
          handicap: 2.0,
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

const SPB_MOCK_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 28191 },
      },
      runners: [
        {
          runner: { marketId: "924.26098", selectionId: 28191 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.26098", selectionId: 28191, handicap: 2 } }],
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

const SIB_SINGLE_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: "924.26098",
              selectionId: 28191,
            },
          ],
        },
      ],

      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 13.0,
      winAverageOdds: 13.0,
      betMinStakeIncrement: 0.01,
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: "924.26098",
        selectionId: 28191,
        handicap: -2,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 13.0 },
        },
        decimalDisplayOdds: {
          decimalOdds: 13.0,
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
        marketId: "924.26098",
        selectionId: 28191,
        handicap: 2,
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
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MARKET_VIEW_MOCK.urn, { oddsMovement: "false" }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
    await mockService.mockHttpRequest(getMarketLayout(BFF_MARKET_VIEW_MOCK));
    await browser.url(routes.getMarketViewUrl("924.26098"));

    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: marketPagePO.market,
        price: 13,
      }),
    );
  });

  describe("When user clicks on the bet button of the first runner", () => {
    beforeAll(async () => {
      await firstRunnerBetButtonPO.element.waitForClickable();
      await firstRunnerBetButtonPO.element.click();
      await browser.waitUntilEquals(betDetailsPO.title, "Villarreal (-2)");
      await betDetailsPO.remove.waitForExist();
    });

    it("[PRPI-6338] Should show the correct runner name with the correct handicap", async () => {
      expect(await betDetailsPO.title.getText()).toBe("Villarreal (-2)");
    });

    it("[PRPI-6339] Should show the correct market name", async () => {
      expect(await betDetailsPO.subtitle.getText()).toBe("Alternative Handicaps - Villarreal v Arsenal");
    });

    it("[PRPI-6340] Should show the trash bin icon", async () => {
      expect(await betDetailsPO.remove.isDisplayed()).toBe(true);
    });

    describe("When the handicap value gets updated", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_UPDATE_HANDICAP));
        await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK_HANDICAP_UPDATE));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(betDetailsPO.title, "Villarreal (+2)");
      });

      it("[PRPI-6341] Should show the correct runner name with the updated handicap", async () => {
        expect(await betDetailsPO.title.getText()).toBe("Villarreal (+2)");
      });

      it("[PRPI-6342] Should show warning message about the updated handicap", async () => {
        expect(await alertPO.message.getText()).toBe("The Handicap has changed");
      });

      it("[PRPI-6343] The place button should show the text 'Please Enter Stake'", async () => {
        expect(await placeButtonPO.label.getText()).toBe("Please Enter Stake");
      });

      describe("When adding stake", () => {
        beforeAll(async () => {
          await stakeFieldPO.setValue("1");
        });

        it("[PRPI-6344] The place button should show the text 'Place $1.00 Bet'", async () => {
          expect(await placeButtonPO.label.getText()).toBe("Place $1.00 Bet");
        });

        describe("When the odds value change", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_UPDATE_ODDS));
            await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_ODDS_MOVEMENT_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilEquals(alertPO.message, "The Odds and Handicap have changed");
          });

          it("[PRPI-6345] Should show warning message about the updated handicap and the changed odds", async () => {
            expect(await alertPO.message.getText()).toBe("The Odds and Handicap have changed");
          });

          it("[PRPI-6346] The place button should show the text 'Accept @2.3 & Place $1.00 Bet'", async () => {
            expect(await placeButtonPO.secondaryLabel.getText()).toBe("Accept @2.3 &");
            expect(await placeButtonPO.label.getText()).toBe("Place $1.00 Bet");
          });

          describe("When user clicks on the place button and the receipt panel is shown", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
              await placeButtonPO.element.waitForClickable();
              await placeButtonPO.element.click();
              await browser.waitUntilEquals(betslipDrawerPO.header, "Bet Placed");
            });

            it("[PRPI-6347] Should show the correct runner name with the correct handicap", async () => {
              expect(await receiptBetDetailsPO.title.getText()).toBe("Villarreal (+2)");
            });

            it("[PRPI-6347] Should show the correct market name", async () => {
              expect(await receiptBetDetailsPO.subtitle.getText()).toBe("Alternative Handicaps - Villarreal v Arsenal");
            });
          });
        });
      });
    });
  });
});
