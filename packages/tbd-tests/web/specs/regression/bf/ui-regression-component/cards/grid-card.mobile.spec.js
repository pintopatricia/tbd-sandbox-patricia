const { RunnerPO, ShowMorePO, BetDetailsPO, MarketBlurbsPO } = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const GridCardPO = require("@ppb/tbd-shared/components/GridCard/GridCard.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const gridCardPO = new GridCardPO();
const firstRunnerPO = new RunnerPO(gridCardPO.runners[0]);
const secondRunnerPO = new RunnerPO(gridCardPO.runners[1]);
const thirdRunnerPO = new RunnerPO(gridCardPO.runners[2]);
const lastRunnerPO = new RunnerPO(gridCardPO.runners[3]);
const showMorePO = new ShowMorePO();
const selectionPO = new BetDetailsPO();
const marketBlurbsPO = new MarketBlurbsPO();

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
    name: "Bernardo Silva",
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
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      name: "Wolves v Man Utd",
      urn: "ppb:event:1",
      eventId: 1,
    },
  },
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

/**
 * Mocks a page with a single GridCard where all runners matches on every market except one
 * where there is a typo on the runner name (Cristiano Reinaldo)
 */
const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:event:1",
  sportevent: {
    urn: "ppb:event:1",
    eventId: 1,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "GridCard",
        urn: "ppb:tbd:card:grid:123456",
        numberOfItemsToDisplay: 3,
        layout: "VERTICAL_MARKETS",
        markets: [
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
        ],

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
              name: "Bernardo Silva",
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

describe("GridCard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse({}));
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await browser.url(routes.getEventViewUrl("1"));
    await browser.waitUntilDisplayed(firstRunnerPO.element);
    await browser.waitUntilDisplayed(marketBlurbsPO.azSwitcher);
  });

  it("[PRPI-5675] The player prop markets should be displayed in a default order", async () => {
    expect(await gridCardPO.runners.length).toBe(3);
    expect(await firstRunnerPO.runnerName.getText()).toBe("Bruno Fernandes");
    expect(await secondRunnerPO.runnerName.getText()).toEqual("Bernardo Silva");
    expect(await thirdRunnerPO.runnerName.getText()).toEqual("Cristiano Ronaldo");
  });

  describe("and then user switches a-z on", () => {
    beforeAll(async () => {
      await marketBlurbsPO.azSwitcher.click();
      await browser.waitUntilEquals(firstRunnerPO.runnerName, "Bernardo Silva");
    });

    it("[PRPI-5676] runner names should be alphabetically sorted", async () => {
      expect(await firstRunnerPO.runnerName.getText()).toEqual("Bernardo Silva");
      expect(await secondRunnerPO.runnerName.getText()).toEqual("Bruno Fernandes");
      expect(await thirdRunnerPO.runnerName.getText()).toEqual("Cristiano Reinaldo");
    });
  });

  describe("When the user clicks on show more option", () => {
    beforeAll(async () => {
      await showMorePO.element.click();
      await browser.waitUntilDisplayed(lastRunnerPO.element);
    });

    it("[PRPI-8329] The card should expand and display the rest of the runners and respective prices sorted alphabetically", async () => {
      expect(await firstRunnerPO.runnerName.getText()).toBe("Bernardo Silva");
      expect(await secondRunnerPO.runnerName.getText()).toBe("Bruno Fernandes");
      expect(await thirdRunnerPO.runnerName.getText()).toBe("Cristiano Reinaldo");
      expect(await lastRunnerPO.runnerName.getText()).toBe("Cristiano Ronaldo");
    });

    describe("and then the user switches the az back off", () => {
      beforeAll(async () => {
        await marketBlurbsPO.azSwitcher.click();
        await browser.waitUntilEquals(firstRunnerPO.runnerName, "Bruno Fernandes");
      });

      it("[PRPI-8330] The runners should now be sorted as they were initially", async () => {
        expect(await firstRunnerPO.runnerName.getText()).toBe("Bruno Fernandes");
        expect(await secondRunnerPO.runnerName.getText()).toBe("Bernardo Silva");
        expect(await thirdRunnerPO.runnerName.getText()).toBe("Cristiano Ronaldo");
        expect(await lastRunnerPO.runnerName.getText()).toBe("Cristiano Reinaldo");
      });
    });
  });

  describe("When the user clicks on show less", () => {
    beforeAll(async () => {
      await showMorePO.element.click();
      await browser.tickFakeClock();
      await browser.waitUntilEquals(showMorePO.element, "Show More");
    });

    it("[PRPI-5679] the card should shrink to show equal before expanded and the app should scroll to the card.", async () => {
      expect(await gridCardPO.element.isDisplayed()).toBe(true);
      expect(await gridCardPO.runners.length).toBe(3);
    });
  });

  describe("When the user clicks on a price available", () => {
    beforeAll(async () => {
      await firstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(selectionPO.element);
    });

    it("[PRPI-8331] The betslip should be displayed", async () => {
      expect(await selectionPO.element).not.toBeNull();
    });

    it("[PRPI-8332] The selections should have correct title", async () => {
      expect(await selectionPO.title.getText()).toBe("Bruno Fernandes");
    });

    it("[PRPI-8333] The selections should have correct subtitle", async () => {
      expect(await selectionPO.subtitle.getText()).toBe("Player Shots - Wolves v Man Utd");
    });
  });
});
