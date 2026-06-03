const {
  AppPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  SportsbookMarketPO,
  PrimaryButtonPO,
  AlertPO,
  BetDetailsPO,
  BetControlsPO,
  EventPagePO,
  SportsbookPlacePanelPO,
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
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(placePanelPO.element);
const placeButton = new PrimaryButtonPO(placePanelPO.place);
const placeAlertPO = new AlertPO(placePanelPO.element);
const betDetailsPO = new BetDetailsPO();
const stakeFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);

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

const spbMockFailure = {
  result: [],
  respCode: "BET_PLACEMENT_FAILURE",
};

const spbMockBetFailure = {
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

      resultCode: "STAKE_BELOW_MINIMUM_ALLOWED",
    },
  ],

  respCode: "BET_PLACEMENT_FAILURE",
};

const spbMockRunnerFailure = {
  result: [
    {
      runners: [{ failureCode: "MARKET_SUSPENDED", runner: { marketId: "924.193270252", selectionId: 48044 } }],
      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.193270252", selectionId: 48044 } }],
          },
        },
      ],

      resultCode: "BET_PLACEMENT_RUNNER_FAILURE",
    },
  ],

  respCode: "BET_PLACEMENT_FAILURE",
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
};

describe("Sportsbook Bet Placement Failures", () => {
  describe("when placing a bet with bet placement failure", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(smpMock));
      await mockService.mockHttpRequest(getPlaceBet(spbMockFailure));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await browser.url(routes.getEventViewUrl(EVENT_ID));

      await browser.waitUntilDisplayed(firstRunnerSportsbookPO.sportsbookBetButton);
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));
      await firstRunnerSportsbookPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(placePanelPO.element, "Singles betslip not displayed");

      await stakeFieldPO.setValue("2");

      await placeButton.element.click();
      await browser.waitUntilDisplayed(placeAlertPO.icon);
    });

    afterAll(async () => {
      await betDetailsPO.remove.waitForClickable();
      await betDetailsPO.remove.click();
      await browser.waitUntilNotDisplayed(placePanelPO.element);
    });

    it("[PRPI-8067] should open the betslip", async () => {
      expect(await placePanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8068] should have the place bet button enabled", async () => {
      expect(await placeButton.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8069] should show a error notification with the message", async () => {
      expect(await placeAlertPO.icon.isDisplayed()).toBe(true);
      expect(await placeAlertPO.message.getText()).toBe("Your bets could not be placed.");
    });
  });

  describe("when placing a bet with stake below minimum", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(smpMock));
      await mockService.mockHttpRequest(getPlaceBet(spbMockBetFailure));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await browser.url(routes.getEventViewUrl(EVENT_ID));

      await browser.waitUntilDisplayed(firstRunnerSportsbookPO.sportsbookBetButton);
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));
      await firstRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element);

      await stakeFieldPO.setValue("2");
      await placeButton.element.click();
      await browser.waitUntilDisplayed(placeAlertPO.icon);
    });

    afterAll(async () => {
      await betDetailsPO.remove.waitForClickable();
      await betDetailsPO.remove.click();
      await browser.waitUntilNotDisplayed(placePanelPO.element);
    });

    it("[PRPI-8070] should open the betslip", async () => {
      expect(await placePanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8071] should have the place bet button enabled", async () => {
      expect(await placeButton.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8072] should show a error notification with the message", async () => {
      expect(await placeAlertPO.icon.isDisplayed()).toBe(true);
      expect(await placeAlertPO.message.getText()).toBe("Your stake(s) are below the minimum limit.");
    });
  });

  describe("when placing a bet with a suspended market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { currencyCode: "USD", countryCode: "US" }));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(smpMock));
      await mockService.mockHttpRequest(getPlaceBet(spbMockRunnerFailure));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await browser.url(routes.getEventViewUrl(EVENT_ID));

      await browser.waitUntilDisplayed(firstRunnerSportsbookPO.sportsbookBetButton);
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));
      await firstRunnerSportsbookPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(placePanelPO.element);

      await stakeFieldPO.setValue("2");
      await placeButton.element.click();
      await browser.waitUntilDisplayed(placeAlertPO.icon);
    });

    it("[PRPI-8073] should open the betslip", async () => {
      expect(await placePanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8074] should have the place bet button enabled", async () => {
      expect(await placeButton.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8075] should show a error notification with the message", async () => {
      expect(await placeAlertPO.icon.isDisplayed()).toBe(true);
      expect(await placeAlertPO.message.getText()).toBe("One of your markets is currently suspended.");
    });
  });
});
