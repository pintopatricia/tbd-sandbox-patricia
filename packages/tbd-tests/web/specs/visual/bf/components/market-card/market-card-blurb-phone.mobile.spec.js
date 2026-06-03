const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { MarketPromoPO } = require("../../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MODULE_NAME = "market_card";
const mockService = new MockService();

const marketPromoPO = new MarketPromoPO();

const MARKET_ID = "924.1";
const EVENT_ID = "29682730";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##SUPER_SUB",
        typename: "MarketCard",
        template: "DEFAULT",
        cardTitle: "Super SUB",
        displayRunners: {
          exchange: null,
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
        urn: "ppb:tbd:card:29436223##SUPER_SUB",
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

describe("MarketCard MarketBlurb", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_VIEW_MOCK.urn, {
        SUPER_SUB_MARKET_BLURBS: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getSportViewUrl(1));
    await browser.waitUntilDisplayed(marketPromoPO.element);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1610]_should_render_market_blurb_market_card`);
  });

  it("[PRPI-1610]_should_render_market_blurb_market_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1610]_should_render_market_blurb_market_card`)).toBe(0);
  });

  describe("When the user clicks on the Market Blurb", () => {
    beforeAll(async () => {
      await marketPromoPO.element.waitForClickable();
      await marketPromoPO.element.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1611]_should_render_expanded_market_blurb_market_card`);
    });

    it("[PRPI-1611]_should_render_expanded_market_blurb_market_card`", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1611]_should_render_expanded_market_blurb_market_card`),
      ).toBe(0);
    });
  });
});
