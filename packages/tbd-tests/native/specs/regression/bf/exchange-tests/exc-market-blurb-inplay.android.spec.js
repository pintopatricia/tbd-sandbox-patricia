const { CardSO, ExchangeMarketSO, GenericScreenSO, MarketBlurbsSO } = require("../../../../screen-objects");

const {
  getAppContext,
  getMarketLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const genericScreenSO = new GenericScreenSO();

const marketCardSO = new CardSO(genericScreenSO.market);
const exchangeMarketSO = new ExchangeMarketSO(marketCardSO.exchangeMarket);
const marketBlurbsSO = new MarketBlurbsSO(exchangeMarketSO.element);

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

const setup = async ({ turnInPlayEnabled = true, inplay = false, shouldTerminateAppBeforeStart = false } = {}) => {
  const BFF_MOCK = getBFFMock({ turnInPlayEnabled, inplay });

  await mockService.mockHttpRequest(getAppContext({}));
  await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }, 404));
  await mockService.mockHttpRequest(getScaResponse({}));
  await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK));

  const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/market/m-${MARKET_ID}`);
  await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

  await startApp("home", {
    isViewLinkStartPage: !!HOME_VIEW_LINK,
    shouldTerminateAppBeforeStart,
  });
  await browser.waitUntilDisplayed(genericScreenSO.element);
  await browser.waitUntilDisplayed(exchangeMarketSO.element);
  await browser.waitUntilDisplayed(marketBlurbsSO.element);
};

describe("Exchange - Market Blurb - Inplay", () => {
  describe("when navigating to the market view", () => {
    describe("and when the market can turn in-play", () => {
      describe("and the market is in-play", () => {
        beforeAll(async () => {
          await setup({ turnInPlayEnabled: true, inplay: true });
          await browser.waitUntilDisplayed(marketBlurbsSO.goingInPlay);
        });

        it("[PRPI-3602] the market blurb should display the in-play icon", async () => {
          expect(await marketBlurbsSO.goingInPlay.isDisplayed()).toBe(true);
        });
      });

      describe("and the market is not in-play", () => {
        beforeAll(async () => {
          await setup({
            turnInPlayEnabled: true,
            inplay: false,
            shouldTerminateAppBeforeStart: true,
          });
          await browser.waitUntilDisplayed(marketBlurbsSO.goingInPlay);
        });

        it("[PRPI-3603] the market blurb should display the going in-play icon", async () => {
          expect(await marketBlurbsSO.goingInPlay.isDisplayed()).toBe(true);
        });
      });
    });

    describe("and when the market cannot turn in-play", () => {
      describe("and the market is in-play", () => {
        beforeAll(async () => {
          await setup({
            turnInPlayEnabled: false,
            inplay: true,
            shouldTerminateAppBeforeStart: true,
          });
        });

        it("[PRPI-3604] the market blurb should not display the in-play icon", async () => {
          expect(await marketBlurbsSO.goingInPlay.isDisplayed()).toBe(false);
        });
      });

      describe("and the market is not in-play", () => {
        beforeAll(async () => {
          await setup({
            turnInPlayEnabled: false,
            inplay: false,
            shouldTerminateAppBeforeStart: true,
          });
        });

        it("[PRPI-3605] the market blurb should not display the in-play icon", async () => {
          expect(await marketBlurbsSO.goingInPlay.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
