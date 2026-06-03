const {
  AppPO,
  CardPO,
  SportsbookMarketPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  BetDetailsPO,
  BetControlsPO,
  BetslipDrawerPO,
  EventPagePO,
  SportsbookPlacePanelPO,
  SportsbookReceiptPanelPO,
  RunnerPO,
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
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const runnerFirstMarketSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO();
const potentialBetDetailsPO = new BetDetailsPO(placePanelPO.element);
const singlesStakeInputField = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const singlesPlaceButton = new PrimaryButtonPO(placePanelPO.place);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const singleSelectionPO = new BetDetailsPO(sportsbookReceiptPanelPO.singles[0]);
const betslipDrawerPO = new BetslipDrawerPO();
const receiptTitle = betslipDrawerPO.header;

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
  ],

  partialEdges: [
    {
      node: { urn: "ppb:tbd:card:29436223:MATCH_ODDS", __typename: "MarketCard" },
    },
  ],
};

const spbMockSuccess = {
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

describe("Sportsbook Re-use selections", () => {
  describe("When the user places a single SBK bet with success", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { oddsMovement: "false" }));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(smpMock, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getPlaceBet(spbMockSuccess));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));
      await runnerFirstMarketSportsbookPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(placePanelPO.element);

      await singlesStakeInputField.numberField.setValue(1);
      await singlesPlaceButton.element.click();
      await browser.waitUntilDisplayed(receiptTitle);
    });

    it("[PRPI-974] The 'Bet Placed' panel should be visible", async () => {
      expect(await sportsbookReceiptPanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8061] The 'Selection A' should be visible", async () => {
      expect(await singleSelectionPO.title.getText()).toBe("Selection A");
    });

    it("[PRPI-976] The 'Re-use selections' CTA button should be visible", async () => {
      expect(await sportsbookReceiptPanelPO.reUseSelectionsContainer.isDisplayed()).toBe(true);
    });

    describe("When the user taps 'Re-use selections' CTA button", () => {
      beforeAll(async () => {
        await sportsbookReceiptPanelPO.reUseSelectionsContainer.click();
        await browser.waitUntilDisplayed(placePanelPO.element);
      });

      it("[PRPI-973] The betslip should expand", async () => {
        expect(await placePanelPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-8062] The 'Selection A' should be visible", async () => {
        expect(await potentialBetDetailsPO.title.getText()).toBe("Selection A");
      });
    });
  });
});
