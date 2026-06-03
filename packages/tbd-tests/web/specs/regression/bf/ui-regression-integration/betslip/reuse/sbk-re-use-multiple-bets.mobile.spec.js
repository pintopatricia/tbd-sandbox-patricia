const {
  AppPO,
  MinimizedPO,
  EventPagePO,
  BetLegsPO,
  SportsbookReceiptPanelPO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  BetslipDrawerPO,
  BetControlsPO,
  BetSelectionsPO,
  BetSelectionDetailsPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const secondCardPO = new CardPO(eventPagePO.markets[1]);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const secondSportsbookMarketPO = new SportsbookMarketPO(secondCardPO.sportsbookMarket);
const runnerFirstMarketSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const runnerSecondMarketSportsbookPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.element);
const multiplesStakeInputFiled = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);
const multiplesPlaceButton = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const betslipDrawerPO = new BetslipDrawerPO();
const receiptTitle = betslipDrawerPO.header;
const multiplesCollapsePO = new BetSelectionsPO();
const firstBetSelectionPO = new BetSelectionDetailsPO(multiplesCollapsePO.selections[0]);
const secondBetSelectionPO = new BetSelectionDetailsPO(multiplesCollapsePO.selections[1]);
const betLegsPO = new BetLegsPO();
const firstMultipleSelection = new BetSelectionDetailsPO(betLegsPO.selections[0]);
const secondMultipleSelection = new BetSelectionDetailsPO(betLegsPO.selections[1]);

const minimizedBetslipPO = new MinimizedPO();

const mockService = new MockService();

const EVENT_ID = "29359895";

const smpMock = {
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
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
  },
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
                  name: "Selection A",
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
                  name: "Selection B",
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

const spbDoubleMockSuccess = {
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

describe("Sportsbook Re-use selections", () => {
  describe("When the user places a multiple SBK bet with success", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { oddsMovement: "false" }));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(smpMock));
      await mockService.mockHttpRequest(getPlaceBet(spbDoubleMockSuccess));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));
      await runnerFirstMarketSportsbookPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);

      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(sportsbookPlacePanelPO.element, "Singles panel hasn't been minimized");
      await browser.waitUntilDisplayed(minimizedBetslipPO.element);

      await runnerSecondMarketSportsbookPO.sportsbookBetButton.scrollIntoView();
      await browser.waitUntilDisplayed(runnerSecondMarketSportsbookPO.sportsbookBetButton, "Bet button is not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await runnerSecondMarketSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntil(
        async () => {
          const title = await minimizedBetslipPO.title.getText();

          return title.includes("2.4");
        },
        {
          timeoutMsg: "2 Leg multiple was not combined",
        },
      );

      await minimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Multiples place panel couldn't be opened");

      await multiplesStakeInputFiled.numberField.setValue(1);
      await multiplesPlaceButton.element.click();
      await browser.waitUntilDisplayed(receiptTitle);
    });

    it("[PRPI-8054] The 'Bet Placed' panel should be visible", async () => {
      expect(await sportsbookReceiptPanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8055] The 'Selection A' and 'Selection B' should be visible", async () => {
      expect(await firstBetSelectionPO.title.getText()).toBe("Selection A");
      expect(await secondBetSelectionPO.title.getText()).toBe("Selection B");
    });

    it("[PRPI-8056] The 'Re-use selections' CTA button should be visible", async () => {
      expect(await sportsbookReceiptPanelPO.reUseSelectionsContainer.isDisplayed()).toBe(true);
    });

    describe("When the user taps 'Re-use selections' CTA button", () => {
      beforeAll(async () => {
        await sportsbookReceiptPanelPO.reUseSelectionsContainer.click();
        await browser.waitUntilDisplayed(minimizedBetslipPO.element);
      });

      it("[PRPI-8057] The betslip should collapse", async () => {
        expect(await minimizedBetslipPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-8058] The betslip counter should be visible '2'", async () => {
        expect(await minimizedBetslipPO.counter.getText()).toBe("2");
      });

      describe("When the users taps the handle button", () => {
        beforeAll(async () => {
          await minimizedBetslipPO.element.click();
          await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Place panel couldn't be opened");
        });

        it("[PRPI-8059] The betslip should expand", async () => {
          expect(await sportsbookPlacePanelPO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-8060] The 'Selection A' and 'Selection B' should be visible", async () => {
          expect(await firstMultipleSelection.title.getText()).toBe("Selection A");
          expect(await secondMultipleSelection.title.getText()).toBe("Selection B");
        });
      });
    });
  });
});
