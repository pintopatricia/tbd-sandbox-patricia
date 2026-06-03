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

const createRunnersMock = (marketId, withTypo = false) => [
  {
    __typename: "Runner",
    runnerURN: `ppb:sbkRunner:${marketId}/55190`,
    name: "Bruno Fernandes",
    selectionId: 55190,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: `ppb:sbkRunner:${marketId}/2426`,
    name: "Bernardo Silva will score 2 or more goals and will assist for Bruno Fernandes goal outside the box with the right foot",
    selectionId: 2426,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: withTypo ? `ppb:sbkRunner:${marketId}/34457` : `ppb:sbkRunner:${marketId}/58805`,
    name: withTypo ? "Cristiano Reinaldo" : "Cristiano Ronaldo",
    selectionId: withTypo ? 34457 : 58805,
    handicap: 0,
    resultType: null,
  },
];

const FIRST_SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.11111",
  name: "Player Shots",
  runners: createRunnersMock("924.11111"),
};

const SECOND_SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.22222",
  name: "Match Odds",
  runners: createRunnersMock("924.22222", true),
};

const THIRD_SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.33333",
  name: "Match Odds",
  runners: createRunnersMock("924.33333"),
};

const createMarketsMock = (hasMarketLabel = true) => [
  ...(hasMarketLabel
    ? [
        {
          displayLabel: {
            __typename: "DisplayNameTitle",
            name: "1+",
          },
          market: FIRST_SPORTSBOOK_MARKET,
        },
        {
          displayLabel: {
            __typename: "DisplayNameTitle",
            name: "2+",
          },
          market: SECOND_SPORTSBOOK_MARKET,
        },
        {
          displayLabel: {
            __typename: "DisplayNameTitle",
            name: "3+",
          },
          market: THIRD_SPORTSBOOK_MARKET,
        },
      ]
    : [
        {
          displayLabel: null,
          market: FIRST_SPORTSBOOK_MARKET,
        },
      ]),
];

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
        layout: "VERTICAL_MARKETS",
        markets: createMarketsMock(),
        runners: [
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Bruno Fernandes",
            },
            runner: createRunnersMock("924.11111")[0],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Bernardo Silva will score 2 or more goals and will assist for Bruno Fernandes goal outside the box with the right foot",
            },
            runner: createRunnersMock("924.11111")[1],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Cristiano Ronaldo",
            },
            runner: createRunnersMock("924.11111")[2],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Cristiano Reinaldo",
            },
            runner: createRunnersMock("924.22222", true)[2],
          },
        ],
      },
    },
    {
      node: {
        __typename: "GridCard",
        urn: "ppb:tbd:card:grid:111",
        numberOfItemsToDisplay: 3,
        layout: "VERTICAL_MARKETS",
        markets: createMarketsMock(false),
        runners: [
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Bruno Fernandes",
            },
            runner: createRunnersMock("924.11111")[0],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Bernardo Silva will score 2 or more goals and will assist for Bruno Fernandes goal outside the box with the right foot",
            },
            runner: createRunnersMock("924.11111")[1],
          },
          {
            displayName: {
              __typename: "DisplayNameTitle",
              name: "Cristiano Ronaldo",
            },
            runner: createRunnersMock("924.11111")[2],
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
    {
      node: {
        __typename: "GridCard",
        urn: "ppb:tbd:card:grid:111",
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

describe("GridCardVertical", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getSportViewUrl(1));
    await browser.waitUntilDisplayed(firstRunnerPO.element);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1602]_should_render_grid_card`);
  });

  it("[PRPI-1602]_should_render_grid_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1602]_should_render_grid_card`)).toBe(0);
  });

  describe("When the user clicks on 'show more' option", () => {
    beforeAll(async () => {
      await showMorePO.element.click();

      await browser.waitUntil(async () => {
        const runners = await gridCardPO.runners.length;
        return runners === 4;
      });

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4786]_should_render_expanded_grid_card`);
    });

    it("[PRPI-4786]_should_render_expanded_grid_card", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4786]_should_render_expanded_grid_card`)).toBe(0);
    });
  });
});
