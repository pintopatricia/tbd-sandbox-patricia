const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { MarketPromoPO } = require("../../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MODULE_NAME = "grid_card";
const mockService = new MockService();

const marketPromoPO = new MarketPromoPO();

const createRunnerMock = (marketId, selectionId) => ({
  __typename: "Runner",
  runnerURN: `ppb:sbkRunner:${marketId}/${selectionId}`,
});

const createMarketMock = (marketId, name, isSuperSub = null) => ({
  market: {
    __typename: "SportsbookMarket",
    urn: `ppb:sbkMarket:${marketId}`,
    runners: [createRunnerMock(marketId, 55190), createRunnerMock(marketId, 2426), createRunnerMock(marketId, 58805)],
    isSuperSub,
  },
  displayLabel: {
    __typename: "DisplayNameTitle",
    name,
  },
});

const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "GridCard",
        urn: "ppb:tbd:card:grid:123456",
        markets: [
          createMarketMock("924.11111", "1+", false),
          createMarketMock("924.22222", "2+", true),
          createMarketMock("924.33333", "3+"),
        ],

        runners: [
          {
            runner: createRunnerMock("924.11111", 55190),
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Bruno Fernandes",
            },
          },
          {
            runner: createRunnerMock("924.11111", 2426),
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Bernardo Silva",
            },
          },
          {
            runner: createRunnerMock("924.11111", 58805),
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Cristiano Ronaldo",
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GridCard",
        urn: "ppb:tbd:card:grid:123456",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.11111",
      runnerDetails: [
        {
          selectionId: 55190,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2426,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.22222",
      runnerDetails: [
        {
          selectionId: 55190,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2426,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 34457,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.33333",
      runnerDetails: [
        {
          selectionId: 55190,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

describe("GridCard MarketBlurb", () => {
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
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1598]_should_render_market_blurb_grid_card`);
  });

  it("[PRPI-1598]_should_render_market_blurb_grid_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1598]_should_render_market_blurb_grid_card`)).toBe(0);
  });

  describe("When the user clicks on the Market Blurb", () => {
    beforeAll(async () => {
      await marketPromoPO.element.waitForClickable();
      await marketPromoPO.element.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1599]_should_render_expanded_market_blurb_grid_card`);
    });

    it("[PRPI-1599]_should_render_expanded_market_blurb_grid_card", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1599]_should_render_expanded_market_blurb_grid_card`),
      ).toBe(0);
    });
  });
});
