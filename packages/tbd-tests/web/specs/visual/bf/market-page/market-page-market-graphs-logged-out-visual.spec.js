const { MarketPagePO, CardPO, ExchangeMarketPO, RunnerPO } = require("../../../../page-objects");
const { getMarketLayout, getRunnerInformationLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../mocks/webserver/webserver-controller");
const { getMockFonts } = require("../../mocks/fonts/fonts-controller");

const MockService = require("../../helpers/mocking-service");
const routes = require("../../../utils/routes");

const marketPagePO = new MarketPagePO();
const marketCardPO = new CardPO(marketPagePO.market);
const exchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);

const mockService = new MockService();
const EXCHANGE_MARKET_ID = "1.123456789";
const EVENT_ID = "29682729";

const EXCHANGE_MARKET = {
  eventId: EVENT_ID,
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_MARKET_ID}`,
  name: "Match Odds",
  marketType: "MATCH_ODDS",
  bettingType: "ODDS",
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      name: "Chelsea v Tottenham",
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  runners: [
    {
      __typename: "Runner",
      runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/55190/0`,
      name: "Chelsea",
      selectionId: 55190,
      handicap: 0,
    },
    {
      __typename: "Runner",
      runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48224/0`,
      name: "Tottenham",
      selectionId: 48224,
      handicap: 0,
    },
    {
      __typename: "Runner",
      runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/58805/0`,
      name: "The Draw",
      selectionId: 58805,
      handicap: 0,
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:market:${EXCHANGE_MARKET_ID}`,
  mainMarket: EXCHANGE_MARKET,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture##${EVENT_ID}`,
        sportevent: {
          __typename: "SportsEvent",
          urn: `ppb:event:${EVENT_ID}`,
        },
        fixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: {
            name: "Chelsea",
          },
          away: {
            name: "Tottenham",
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended##${EXCHANGE_MARKET_ID}`,
        cardTitle: "Match Odds",
        defaultIndex: 0,
        displayRunners: {
          exchange: {
            market: EXCHANGE_MARKET,
            runners: [
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/55190/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48224/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/58805/0` },
            ],
          },
        },
        runnerViewLinks: [
          {
            runnerUrn: `ppb:excRunner:${EXCHANGE_MARKET_ID}/55190/0`,
            viewUrn: `ppb:tbd:view:runner:${EXCHANGE_MARKET_ID}/55190/0`,
          },
          {
            runnerUrn: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48224/0`,
            viewUrn: `ppb:tbd:view:runner:${EXCHANGE_MARKET_ID}/48224/0`,
          },
          {
            runnerUrn: `ppb:excRunner:${EXCHANGE_MARKET_ID}/58805/0`,
            viewUrn: `ppb:tbd:view:runner:${EXCHANGE_MARKET_ID}/58805/0`,
          },
        ],
      },
    },
  ],
};

const BFF_MOCK_MARKET_GRAPHS_FORBIDDEN_CARD = {
  __typename: "RunnerView",
  title: "Market Graphs",
  urn: `ppb:tbd:view:runner:${EXCHANGE_MARKET_ID}/55190/0`,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        sportevent: {
          urn: `ppb:event:${EVENT_ID}`,
        },
        fixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: {
            name: "Chelsea",
          },
          away: {
            name: "Tottenham",
          },
        },
        showBroadcasts: true,
      },
    },
    {
      node: {
        __typename: "ForbiddenContentCard",
        urn: "ppb:tbd:card:forbiddenContent:MarketGraphs",
        forbiddenCardType: "MARKET_GRAPHS",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "ForbiddenContentCard",
        urn: "ppb:tbd:card:forbiddenContent:MarketGraphs",
        forbiddenCardType: "MARKET_GRAPHS",
      },
    },
  ],
};

const MODULE_NAME = "market_page";

describe("Market Graphs - Logged Out Experience", () => {
  describe("When a logged out user navigates to the market view and clicks on the first runner of the market", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { loggedIn: "false" }));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getRunnerInformationLayout(BFF_MOCK_MARKET_GRAPHS_FORBIDDEN_CARD));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MARKET_ID));
      await firstRunnerExchangePO.runnerButton.waitForClickable();
      await firstRunnerExchangePO.runnerButton.click();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4803]_should_show_the_market_graphs_modal_with_fixture_and_forbidden_cards`,
      );
    });

    it("[PRPI-4803]_should_show_the_market_graphs_modal_with_fixture_and_forbidden_cards", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-4803]_should_show_the_market_graphs_modal_with_fixture_and_forbidden_cards`,
        ),
      ).toBe(0);
    });
  });
});
