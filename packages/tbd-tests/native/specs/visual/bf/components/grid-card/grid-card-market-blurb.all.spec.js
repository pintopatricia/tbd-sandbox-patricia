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

const MODULE_NAME = "grid_card";
const mockService = new MockService();

const marketPromoSO = new MarketPromoSO();

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
          createMarketMock("924.111111", "1+", false),
          createMarketMock("924.222222", "2+", true),
          createMarketMock("924.333333", "3+"),
        ],

        runners: [
          {
            runner: createRunnerMock("924.111111", 55190),
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Bruno Fernandes",
            },
          },
          {
            runner: createRunnerMock("924.111111", 2426),
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Bernardo Silva",
            },
          },
          {
            runner: createRunnerMock("924.111111", 58805),
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
      marketId: "924.111111",
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
      marketId: "924.222222",
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
      marketId: "924.333333",
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

const APP_CONTEXT_MOCK = {
  loggedIn: "true",
  products: ["sportsbook"],
  throttles: {
    SUPER_SUB_MARKET_BLURBS: { isActive: true },
  },
};

describe("GridCard - Market blurb", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));

    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(marketPromoSO.element, "Market blurb is not displayed");
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4915]_should_render_market_blurb_grid_card`);
  });

  it("[PRPI-4915]_should_render_market_blurb_grid_card", async () => {
    expect(
      (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4915]_should_render_market_blurb_grid_card`))
        .misMatchPercentage,
    ).toEqual(0);
  });

  describe("When the user clicks on the Market Blurb", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(marketPromoSO.element, "Market blurb is not clickable");
      await marketPromoSO.element.click();
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4916]_should_render_expanded_market_blurb_grid_card`);
    });

    it("[PRPI-4916]_should_render_expanded_market_blurb_grid_card", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4916]_should_render_expanded_market_blurb_grid_card`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
