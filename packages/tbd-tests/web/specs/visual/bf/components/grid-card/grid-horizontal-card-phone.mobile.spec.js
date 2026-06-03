const { RunnerPO, ShowMorePO } = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const GridCardPO = require("@ppb/tbd-shared/components/GridCard/GridCard.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const gridCardPO = new GridCardPO();
const firstRunnerPO = new RunnerPO(gridCardPO.runners[0]);
const showMorePO = new ShowMorePO();
const MODULE_NAME = "grid_card";

const createRunnersMock = (marketId) => [
  {
    __typename: "Runner",
    runnerURN: `ppb:sbkRunner:${marketId}/55190`,
    name: "OVER",
    selectionId: 55190,
    handicap: 0,
    resultType: null,
    marketURN: `ppb:sbkMarket:${marketId}`,
  },
  {
    __typename: "Runner",
    runnerURN: `ppb:sbkRunner:${marketId}/2426`,
    name: "UNDER",
    selectionId: 2426,
    handicap: 0,
    resultType: null,
    marketURN: `ppb:sbkMarket:${marketId}`,
  },
];

const FIRST_SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.11111",
  name: "0.5 Cards",
  runners: createRunnersMock("924.11111"),
};

const SECOND_SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.22222",
  name: "1.5 Cards",
  runners: createRunnersMock("924.22222"),
};

const THIRD_SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.33333",
  name: "2.5 Cards",
  runners: createRunnersMock("924.33333"),
};

const FOURTH_SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.44444",
  name: "3.5 Cards",
  runners: createRunnersMock("924.44444"),
};

/**
 * Mocks a page with a single GridCard where all runners matches on every market except one
 * where there is a typo on the runner name (Cristiano Reinaldo)
 */
const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "GridCard",
        urn: "ppb:tbd:card:grid:123456",
        numberOfItemsToDisplay: 3,
        layout: "HORIZONTAL_MARKETS",
        markets: [
          {
            displayLabel: {
              __typename: "DisplayNameTitle",
              name: "0.5 Cards",
            },
            market: FIRST_SPORTSBOOK_MARKET,
          },
          {
            displayLabel: {
              __typename: "DisplayNameTitle",
              name: "1.5 Cards",
            },
            market: SECOND_SPORTSBOOK_MARKET,
          },
          {
            displayLabel: {
              __typename: "DisplayNameTitle",
              name: "2.5 Cards",
            },
            market: THIRD_SPORTSBOOK_MARKET,
          },
          {
            displayLabel: {
              __typename: "DisplayNameTitle",
              name: "3.5 Cards",
            },
            market: FOURTH_SPORTSBOOK_MARKET,
          },
        ],

        runners: [
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "OVER",
            },
            runner: createRunnersMock("924.11111")[0],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "UNDER",
            },
            runner: createRunnersMock("924.11111")[1],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "OVER",
            },
            runner: createRunnersMock("924.22222")[0],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "UNDER",
            },
            runner: createRunnersMock("924.22222")[1],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "OVER",
            },
            runner: createRunnersMock("924.33333")[0],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "UNDER",
            },
            runner: createRunnersMock("924.33333")[1],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "OVER",
            },
            runner: createRunnersMock("924.44444")[0],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "UNDER",
            },
            runner: createRunnersMock("924.44444")[1],
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
      ],
    },
    {
      marketId: "924.22222",
      runnerDetails: [
        {
          selectionId: 55190,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
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
      ],
    },
    {
      marketId: "924.44444",
      runnerDetails: [
        {
          selectionId: 55190,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
      ],
    },
  ],
};

describe("GridCardHorizontal", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getSportViewUrl(1));
    await browser.waitUntilDisplayed(firstRunnerPO.element);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1600]_should_render_grid_horizontal_card`);
  });

  it("[PRPI-1600]_should_render_grid_horizontal_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1600]_should_render_grid_horizontal_card`)).toBe(0);
  });

  describe("When the user clicks on 'show more' option", () => {
    beforeAll(async () => {
      await showMorePO.element.click();

      await browser.waitUntil(async () => {
        const runners = await gridCardPO.runners.length;
        return runners === 4;
      });

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4785]_should_render_expanded_grid_horizontal_card`);
    });

    it("[PRPI-4785]_should_render_expanded_grid_card", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4785]_should_render_expanded_grid_horizontal_card`)).toBe(
        0,
      );
    });
  });
});
