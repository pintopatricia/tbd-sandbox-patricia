const {
  AppPO,
  CardPO,
  SportsbookMarketPO,
  BetSegmentsPO,
  BetDetailsPO,
  CurrencyNumberInputFieldPO,
  FixedNumberInputFieldPO,
  PrimaryButtonPO,
  AlertPO,
  BetControlsPO,
  EventPagePO,
  SportsbookReceiptPanelPO,
  SportsbookPlacePanelPO,
  RunnerPO,
  BetslipDrawerPO,
} = require("../../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(placePanelPO.element);
const oddsInputField = new FixedNumberInputFieldPO(controlsPO.fixedInput);
const stakeInputField = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const placeButton = new PrimaryButtonPO(placePanelPO.place);
const alertPO = new AlertPO(placePanelPO.element);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const firstSingleSegmentsPO = new BetSegmentsPO(sportsbookReceiptPanelPO.singles[0]);
const betslipDrawerPO = new BetslipDrawerPO();
const receiptTitle = betslipDrawerPO.header;
const selectionPO = new BetDetailsPO(sportsbookReceiptPanelPO.element);
const selectionPlacePO = new BetDetailsPO(placePanelPO.element);

const mockService = new MockService();

const EVENT_ID = "29359895";

const eroMock = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      { selectionId: "58805", availableToBack: [], availableToLay: [] },
    ],
  },
];

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
                  name: "Wolves",
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

  partialEdges: [{ node: { urn: "ppb:tbd:card:29436223:MATCH_ODDS", __typename: "MarketCard" } }],
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

const spbMockFailure = {
  result: [
    {
      runners: [{ runner: { marketId: "924.193270252", selectionId: 48044 } }],
      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.193270252", selectionId: 48044 } }],
          },
        },
      ],
    },
  ],

  respCode: "GENERAL_FAILURE",
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

describe("Sportsbook Bet Placement", () => {
  describe("with the accept odds movement off and placing a bet with success", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { oddsMovement: "false" }));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(eroMock));
      await mockService.mockHttpRequest(getMarketPrices(smpMock));
      await mockService.mockHttpRequest(getPlaceBet(spbMockSuccess));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));

      await browser.waitUntilDisplayed(firstRunnerSportsbookPO.sportsbookBetButton);
      await firstRunnerSportsbookPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(placePanelPO.element);

      await stakeInputField.setValue("1");
      await placeButton.element.waitForClickable();
      await placeButton.element.click();
      await browser.waitUntilDisplayed(receiptTitle);
    });

    it("[PRPI-8083] should show the receipt title", async () => {
      expect(await receiptTitle.getText()).toBe("Bet Placed");
    });

    it("[PRPI-8084] should show the dismiss button", async () => {
      expect(await receiptTitle.isDisplayed()).toBe(true);
    });

    it("[PRPI-8085] should show the placed selection information", async () => {
      expect(await selectionPO.title.getText()).toBe("Wolves");
      expect(await selectionPO.subtitle.getText()).toBe("Match Odds - Wolves v Man Utd");
      expect(await selectionPO.action.isDisplayed()).toBe(false);
    });

    it("[PRPI-8086] should show the placed selection bet details", async () => {
      expect(await firstSingleSegmentsPO.leftValue.getText()).toBe("2");
      expect(await firstSingleSegmentsPO.midValue.getText()).toBe("$1.00");
      expect(await firstSingleSegmentsPO.rightValue.getText()).toBe("$2.00");
      expect(await firstSingleSegmentsPO.leftLabel.getText()).toBe("Odds");
      expect(await firstSingleSegmentsPO.midLabel.getText()).toBe("Stake");
      expect(await firstSingleSegmentsPO.rightLabel.getText()).toBe("Returns");
    });
  });

  describe("when placing a bet with failure", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(eroMock));
      await mockService.mockHttpRequest(getMarketPrices(smpMock));
      await mockService.mockHttpRequest(getPlaceBet(spbMockFailure));
      await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));

      await browser.waitUntilDisplayed(firstRunnerSportsbookPO.sportsbookBetButton);
      await firstRunnerSportsbookPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(placePanelPO.element);

      await stakeInputField.numberField.setValue(1);
      await placeButton.element.click();
      await browser.waitUntilDisplayed(alertPO.icon);
    });

    afterAll(async () => {
      await selectionPlacePO.remove.waitForClickable();
      await selectionPlacePO.remove.click();
    });

    it("[PRPI-8082] should show a error notification with the message", async () => {
      expect(await alertPO.icon.isDisplayed()).toBe(true);
      expect(await alertPO.message.getText()).toBe(
        "Your bets could not be placed due to an internal error. Please try again.",
      );
    });
  });

  describe("when adding a bet with user preferences set to fractional", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { sportsbookOddsDisplay: "FRACTIONAL" }));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(eroMock));
      await mockService.mockHttpRequest(getMarketPrices(smpMock));
      await mockService.mockHttpRequest(getPlaceBet(spbMockSuccess));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: "1/2" }),
      );

      await browser.waitUntilDisplayed(firstRunnerSportsbookPO.sportsbookBetButton);
      await firstRunnerSportsbookPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(placePanelPO.element);
    });

    it("[PRPI-8090] sbk place panel should display fractional odds", async () => {
      expect(await oddsInputField.numberField.getValue()).toBe("1/2");
    });

    describe("and placing the bet", () => {
      beforeAll(async () => {
        await stakeInputField.setValue("1");
        await placeButton.element.click();
      });

      it("[PRPI-8091] sbk receipt should display fractional odds", async () => {
        expect(await firstSingleSegmentsPO.leftValue.getText()).toBe("1/1");
      });
    });
  });
});
