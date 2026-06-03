const { CardPO, ExchangeMarketPO, MarketBlurbsPO, MarketPagePO } = require("../../../../page-objects");

const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../mocks/webserver/webserver-controller");

const MockService = require("../../helpers/mocking-service");
const routes = require("../../helpers/routes");

const marketPagePO = new MarketPagePO();

const marketCardPO = new CardPO(marketPagePO.market);
const exchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);
const marketBlurbsPO = new MarketBlurbsPO(exchangeMarketPO.element);

const mockService = new MockService();

const EVENT_ID = "29682729";
const MARKET_ID = "1.123456789";

const getBFFMock = ({ turnInPlayEnabled = true, inplay = false } = {}) => {
  const EXCHANGE_MARKET = {
    __typename: "ExchangeMarket",
    urn: `ppb:excMarket:${MARKET_ID}`,
    hierarchy: {
      __typename: "EventHierarchy",
      sportevent: {
        urn: `ppb:event:${EVENT_ID}`,
      },
    },
    runners: [
      {
        runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
        name: "Liverpool",
        selectionId: 55190,
      },
      {
        runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0`,
        name: "Man City",
        selectionId: 48224,
      },
      {
        runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0`,
        name: "The Draw",
        selectionId: 58805,
      },
    ],

    liveData: { turnInPlayEnabled, inplay },
  };

  return {
    __typename: "MarketView",
    urn: `ppb:tbd:view:market:${MARKET_ID}`,
    mainMarket: EXCHANGE_MARKET,
    edges: [
      {
        node: {
          __typename: "FixtureCard",
          urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
          sportevent: { urn: `ppb:event:${EVENT_ID}` },
          fixture: {
            urn: `ppb:fixture:${EVENT_ID}`,
            home: { name: "Man Utd" },
            away: { name: "Wolves" },
          },
        },
      },
      {
        node: {
          __typename: "MarketExtendedCard",
          urn: `ppb:tbd:card:marketExtended:${MARKET_ID}`,
          displayRunners: {
            exchange: {
              market: EXCHANGE_MARKET,
              runners: [
                { runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0` },
                { runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0` },
                { runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0` },
              ],
            },
          },
        },
      },
      {
        node: {
          __typename: "QuickLinksCard",
          urn: `pb:tbd:card:quickLinks:view:event;${EVENT_ID}`,
          viewLink: {
            viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
          },
          sportevent: {
            name: "Man Utd v Wolves",
            urn: `ppb:event:${EVENT_ID}`,
          },
        },
      },
    ],
  };
};

const setup = async ({ turnInPlayEnabled = true, inplay = false } = {}) => {
  const BFF_MOCK = getBFFMock({ turnInPlayEnabled, inplay });

  await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
  await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK));

  await browser.url(routes.getMarketViewUrl(MARKET_ID));
  await browser.waitUntilDisplayed(exchangeMarketPO.element);
  await browser.waitUntilDisplayed(marketBlurbsPO.element);
};

describe("Exchange - Market Blurb - Inplay", () => {
  describe("when navigating to the market view", () => {
    describe("and when the market can turn in-play", () => {
      describe("and the market is in-play", () => {
        beforeAll(async () => {
          await setup({ turnInPlayEnabled: true, inplay: true });
        });

        it("[PRPI-3602] the market blurb should display the in-play icon", async () => {
          expect(await marketBlurbsPO.goingInPlay.isDisplayed()).toBe(true);
        });
      });

      describe("and the market is not in-play", () => {
        beforeAll(async () => {
          await setup({ turnInPlayEnabled: true, inplay: false });
        });

        it("[PRPI-3603] the market blurb should display the going in-play icon", async () => {
          expect(await marketBlurbsPO.goingInPlay.isDisplayed()).toBe(true);
        });
      });
    });

    describe("and when the market cannot turn in-play", () => {
      describe("and the market is in-play", () => {
        beforeAll(async () => {
          await setup({ turnInPlayEnabled: false, inplay: true });
        });

        it("[PRPI-3604] the market blurb should not display the in-play icon", async () => {
          expect(await marketBlurbsPO.goingInPlay.isDisplayed()).toBe(false);
        });
      });
      describe("and the market is not in-play", () => {
        beforeAll(async () => {
          await setup({ turnInPlayEnabled: false, inplay: false });
        });

        it("[PRPI-3605] the market blurb should not display the in-play icon", async () => {
          expect(await marketBlurbsPO.goingInPlay.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
