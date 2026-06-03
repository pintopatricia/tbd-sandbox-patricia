const {
  AppPO,
  EventPagePO,
  ExchangeMarketPO,
  CardPO,
  RunnerPO,
  ExchangeInlinePlacePanelPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const runnerPO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const placePanelPO = new ExchangeInlinePlacePanelPO();

const EVENT_ID = "29359895";

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.01, size: 110 }],
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

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      sport: {
        name: "Football",
        urn: "ppb:eventType:1",
      },
    },
  },
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337355",
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
                  runnerURN: "ppb:excRunner:1.160337355/48044/0",
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/48351/0",
                  selectionId: 48351,
                  name: "Man Utd",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/58805/0",
                  selectionId: 58805,
                  name: "The Draw",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
              { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
              { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],
};

describe("Inline Betslip - Logged Out", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { loggedIn: "false" }));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));

    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  describe("when a logged out user clicks on a bet button", () => {
    beforeAll(async () => {
      await runnerPO.exchangeBetButtons[0].waitForClickable();
      await runnerPO.exchangeBetButtons[0].click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Place panel wasn't displayed");
    });

    it("[PRPI-5359] the inline betslip should display the CTA button with 'Login to Place Bet'", async () => {
      expect(await placePanelPO.placeButton.getText()).toBe("Login to Place Bet");
    });
  });
});
