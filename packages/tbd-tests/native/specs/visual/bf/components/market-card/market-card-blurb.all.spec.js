const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { MarketPromoSO } = require("../../../../../screen-objects");

const MODULE_NAME = "market_card";
const mockService = new MockService();

const marketPromoSO = new MarketPromoSO();

const MARKET_ID = "924.1";
const EVENT_ID = "29682730";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_ID}`,
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}##SUPER_SUB`,
        template: "DEFAULT",
        cardTitle: "Super SUB",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${MARKET_ID}`,
              noLiveData: true,
              name: "Super Sub",
              isSuperSub: true,
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/1`,
                  selectionId: 1,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/2`,
                  selectionId: 2,
                  name: "The Draw",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/3`,
                  selectionId: 3,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:sbkRunner:${MARKET_ID}/1` },
              { runnerURN: `ppb:sbkRunner:${MARKET_ID}/2` },
              { runnerURN: `ppb:sbkRunner:${MARKET_ID}/3` },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: `ppb:tbd:card:${EVENT_ID}##SUPER_SUB`,
        __typename: "MarketCard",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const APP_CONTEXT_MOCK = {
  throttles: {
    SUPER_SUB_MARKET_BLURBS: { isActive: true },
  },
};

describe("MarketCard - Market blurb", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));

    const HOME_VIEW_LINK = getStartViewLink(`football/s-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(marketPromoSO.element, "Market blurb is not displayed");
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4923]_should_render_market_blurb_market_card`);
  });

  it("[PRPI-4923]_should_render_market_blurb_market_card", async () => {
    expect(
      (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4923]_should_render_market_blurb_market_card`))
        .misMatchPercentage,
    ).toEqual(0);
  });

  describe("When the user clicks on the Market Blurb", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(marketPromoSO.element, "Market blurb is not clickable");
      await marketPromoSO.element.click();
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4924]_should_render_expanded_market_blurb_market_card`);
    });

    it("[PRPI-4924]_should_render_expanded_market_blurb_market_card", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4924]_should_render_expanded_market_blurb_market_card`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
