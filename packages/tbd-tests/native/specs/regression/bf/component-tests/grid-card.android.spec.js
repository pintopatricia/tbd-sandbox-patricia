const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const { GridCardSO, RunnerSO, ShowMoreSO, BetDetailsSO, SwitchSO } = require("../../../../screen-objects");

const mockService = new MockService();
const gridCardSO = new GridCardSO();
const firstRunnerSO = new RunnerSO(gridCardSO.runners[0]);
const secondRunnerSO = new RunnerSO(gridCardSO.runners[1]);
const thirdRunnerSO = new RunnerSO(gridCardSO.runners[2]);
const lastRunnerSO = new RunnerSO(gridCardSO.runners[3]);
const showMoreSO = new ShowMoreSO();
const selectionSO = new BetDetailsSO();
const switchSO = new SwitchSO();

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
      eventId: "1",
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
    eventId: "1",
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
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse({}));
    const url = "sport/competition/event/e-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(firstRunnerSO.element);
    await browser.waitUntilDisplayed(switchSO.element);
  });

  it("[PRPI-2209] The player prop markets should be displayed in a default order", async () => {
    expect(await gridCardSO.runners.length).toBe(3);
    expect(await firstRunnerSO.runnerName.getText()).toBe("Bruno Fernandes");
    expect(await secondRunnerSO.runnerName.getText()).toBe("Bernardo Silva");
    expect(await thirdRunnerSO.runnerName.getText()).toBe("Cristiano Ronaldo");
  });

  describe("and then user switches a-z on", () => {
    beforeAll(async () => {
      await switchSO.element.click();
      await browser.waitUntilEquals(firstRunnerSO.runnerName, "Bernardo Silva");
    });

    it("[PRPI-2210] runner names should be alphabetically sorted", async () => {
      expect(await firstRunnerSO.runnerName.getText()).toEqual("Bernardo Silva");
      expect(await secondRunnerSO.runnerName.getText()).toEqual("Bruno Fernandes");
      expect(await thirdRunnerSO.runnerName.getText()).toEqual("Cristiano Reinaldo");
    });

    describe("When the user clicks on 'show more' option", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(showMoreSO.element);
        await showMoreSO.element.click();
        await browser.waitUntilDisplayed(lastRunnerSO.element);
      });

      it("[PRPI-4240] The card should expand and display the rest of the runners and respective prices sorted alphabetically", async () => {
        expect(await firstRunnerSO.runnerName.getText()).toBe("Bernardo Silva");
        expect(await secondRunnerSO.runnerName.getText()).toBe("Bruno Fernandes");
        expect(await thirdRunnerSO.runnerName.getText()).toBe("Cristiano Reinaldo");
        expect(await lastRunnerSO.runnerName.getText()).toBe("Cristiano Ronaldo");
      });

      describe("and then the user switches the az back off", () => {
        beforeAll(async () => {
          await switchSO.element.click();
          await browser.waitUntilEquals(firstRunnerSO.runnerName, "Bruno Fernandes");
        });

        it("[PRPI-4241] The runners should now be sorted as they were initially", async () => {
          expect(await firstRunnerSO.runnerName.getText()).toBe("Bruno Fernandes");
          expect(await secondRunnerSO.runnerName.getText()).toBe("Bernardo Silva");
          expect(await thirdRunnerSO.runnerName.getText()).toBe("Cristiano Ronaldo");
          expect(await lastRunnerSO.runnerName.getText()).toBe("Cristiano Reinaldo");
        });
      });
    });

    describe("When the user clicks on a price 'available'", () => {
      beforeAll(async () => {
        await firstRunnerSO.sbkBetButtons[0].click();
        await browser.waitUntilDisplayed(selectionSO.element);
      });

      it("[PRPI-3778] The betslip should be displayed", async () => {
        expect(await selectionSO.element).not.toBeNull();
      });

      it("[PRPI-3779] The selections should have correct title", async () => {
        expect(await selectionSO.title.getText()).toBe("Bruno Fernandes");
      });

      it("[PRPI-3780] The selections should have correct subtitle", async () => {
        expect(await selectionSO.subtitle.getText()).toBe("Player Shots - Wolves v Man Utd");
      });
    });
  });
});
