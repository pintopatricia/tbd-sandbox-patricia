const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getQuerySportsbookBetButtonResponse,
  getMarkets,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");
const {
  CardSO,
  PopularSelectionsCardSO,
  SportsbookBetButtonSO,
  BetDetailsSO,
  BetslipDrawerSO,
  MinimizedSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const popularSelectionsCardSO = new PopularSelectionsCardSO();
const cardSO = new CardSO();
const betDetailsSO = new BetDetailsSO();
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedBetslipSO = new MinimizedSO();

const firstSelection = popularSelectionsCardSO.selectionItems[0];
const secondSelection = popularSelectionsCardSO.selectionItems[1];
const thirdSelection = popularSelectionsCardSO.selectionItems[2];
const firstSelectionButton = new SportsbookBetButtonSO(popularSelectionsCardSO.betButton(firstSelection));

const EVENT_TYPE_ID = 1;
const FIRST_MARKET_ID = 924.1;
const SECOND_MARKET_ID = 924.2;
const THIRD_MARKET_ID = 924.3;

const CARD_URN = "ppb:tbd:card:popularselections:1";

const RUNNER_MOCK_1 = {
  __typename: "Runner",
  runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
  name: "Sundowns",
  selectionId: 1,
  market: {
    __typename: "SportsbookMarket",
    urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
    name: "Full Time Result",
    liveData: {
      __typename: "SportsbookMarketLiveData",
      urn: `ppb:tbd:sbkMarketLiveData:${FIRST_MARKET_ID}`,
      sportsbookMarketStatus: "OPEN",
      bspMarket: false,
    },
    hierarchy: { __typename: "EventCompetitionHierarchy" },
    isOddsboostMarketType: false,
  },
  runnerLiveData: {
    __typename: "SportsbookRunnerLiveData",
    urn: `ppb:tbd:sbkRunnerLiveData:${FIRST_MARKET_ID}/1`,
    runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
    runnerStatus: "ACTIVE",
    odds: {
      decimal: 2.5,
      fractional: { numerator: 3, denominator: 2, __typename: "FractionalOdds" },
      __typename: "SportsbookOdds",
    },
    displayOdds: {
      decimal: 2.5,
      fractional: { numerator: 3, denominator: 2, __typename: "FractionalOdds" },
      __typename: "SportsbookOdds",
    },
    previousOdds: [],
  },
};

const RUNNER_MOCK_2 = {
  __typename: "Runner",
  runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
  name: "Arsenal",
  market: {
    __typename: "SportsbookMarket",
    urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
    name: "Match Odds",
    liveData: {
      __typename: "SportsbookMarketLiveData",
      urn: `ppb:tbd:sbkMarketLiveData:${SECOND_MARKET_ID}`,
      sportsbookMarketStatus: "OPEN",
      bspMarket: false,
    },
    hierarchy: { __typename: "EventCompetitionHierarchy" },
    isOddsboostMarketType: false,
  },
  runnerLiveData: {
    __typename: "SportsbookRunnerLiveData",
    urn: `ppb:tbd:sbkRunnerLiveData:${SECOND_MARKET_ID}/2`,
    runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
    runnerStatus: "ACTIVE",
    odds: {
      decimal: 1.8,
      fractional: { numerator: 3, denominator: 2, __typename: "FractionalOdds" },
      __typename: "SportsbookOdds",
    },
    displayOdds: {
      decimal: 1.8,
      fractional: { numerator: 3, denominator: 2, __typename: "FractionalOdds" },
      __typename: "SportsbookOdds",
    },
    previousOdds: [],
  },
};

const RUNNER_MOCK_3 = {
  __typename: "Runner",
  runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
  name: "Yes",
  market: {
    __typename: "SportsbookMarket",
    urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
    name: "Both Teams To Score",
    liveData: {
      __typename: "SportsbookMarketLiveData",
      urn: `ppb:tbd:sbkMarketLiveData:${THIRD_MARKET_ID}`,
      sportsbookMarketStatus: "OPEN",
      bspMarket: false,
    },
    hierarchy: { __typename: "EventCompetitionHierarchy" },
    isOddsboostMarketType: false,
  },
  runnerLiveData: {
    __typename: "SportsbookRunnerLiveData",
    urn: `ppb:tbd:sbkRunnerLiveData:${THIRD_MARKET_ID}/3`,
    runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
    runnerStatus: "ACTIVE",
    odds: {
      decimal: 1.65,
      fractional: { numerator: 3, denominator: 2, __typename: "FractionalOdds" },
      __typename: "SportsbookOdds",
    },
    displayOdds: {
      decimal: 1.65,
      fractional: { numerator: 3, denominator: 2, __typename: "FractionalOdds" },
      __typename: "SportsbookOdds",
    },
    previousOdds: [],
  },
};

const POPULAR_SELECTIONS_CARD_DATA = {
  __typename: "PopularSelectionsCard",
  urn: CARD_URN,
  title: "Popular",
  visibleSelectionsLimit: 6,
  isExpandable: true,
  isExpandedByDefault: true,
  popularDisplayMode: "LIST",
  popularSelectionsCardItems: [
    {
      __typename: "PopularSelectionsItem",
      runner: {
        __typename: "Runner",
        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
        name: "Sundowns",
        selectionId: 1,
        participantId: null,
        runnerLiveData: RUNNER_MOCK_1.runnerLiveData,
      },
      market: {
        __typename: "SportsbookMarket",
        urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
        name: "Full Time Result",
        liveData: RUNNER_MOCK_1.market.liveData,
      },
      stats: {
        __typename: "PopularSelectionsItemStats",
        betCount: 5000,
      },
    },
    {
      __typename: "PopularSelectionsItem",
      runner: {
        __typename: "Runner",
        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
        name: "Arsenal",
        selectionId: 2,
        participantId: null,
        runnerLiveData: RUNNER_MOCK_2.runnerLiveData,
      },
      market: {
        __typename: "SportsbookMarket",
        urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
        name: "Match Odds",
        liveData: RUNNER_MOCK_2.market.liveData,
      },
      stats: {
        __typename: "PopularSelectionsItemStats",
        betCount: 2553,
      },
    },
    {
      __typename: "PopularSelectionsItem",
      runner: {
        __typename: "Runner",
        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
        name: "Yes",
        selectionId: 3,
        participantId: null,
        runnerLiveData: RUNNER_MOCK_3.runnerLiveData,
      },
      market: {
        __typename: "SportsbookMarket",
        urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
        name: "Both Teams To Score",
        liveData: RUNNER_MOCK_3.market.liveData,
      },
      stats: {
        __typename: "PopularSelectionsItemStats",
        betCount: 957,
      },
    },
  ],
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: POPULAR_SELECTIONS_CARD_DATA,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: POPULAR_SELECTIONS_CARD_DATA.__typename,
        urn: POPULAR_SELECTIONS_CARD_DATA.urn,
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: `${FIRST_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.5 },
          },
        },
      ],
    },
    {
      marketId: `${SECOND_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.8 },
          },
        },
      ],
    },
    {
      marketId: `${THIRD_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.65 },
          },
        },
      ],
    },
  ],
};

const IMPLY_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: FIRST_MARKET_ID,
              selectionId: 1,
            },
          ],
        },
      ],
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 1,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 2.5 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.5,
        },
      },
    },
  ],
};

const GET_MARKETS_MOCK = {
  markets: [
    { urn: `ppb:sbkMarket:${FIRST_MARKET_ID}` },
    { urn: `ppb:sbkMarket:${SECOND_MARKET_ID}` },
    { urn: `ppb:sbkMarket:${THIRD_MARKET_ID}` },
  ],
};

describe("PopularSelectionsCard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK), { ignoreRequestedMarketIdsMatch: true });
    await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
    await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
    await mockService.mockHttpRequest(getQuerySportsbookBetButtonResponse(RUNNER_MOCK_1));
    await mockService.mockHttpRequest(getQuerySportsbookBetButtonResponse(RUNNER_MOCK_2));
    await mockService.mockHttpRequest(getQuerySportsbookBetButtonResponse(RUNNER_MOCK_3));

    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));

    const url = `football/s-${EVENT_TYPE_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(popularSelectionsCardSO.element);
    await browser.waitUntilEquals(cardSO.title, "Popular");
  });

  it("[PRPI-9391] The popular selections card should be displayed", async () => {
    expect(await popularSelectionsCardSO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-9392] Should display three selection items", async () => {
    expect(await popularSelectionsCardSO.selectionItems.length).toBe(3);
  });

  it("[PRPI-9393] The first selection should display the correct runner and market names and odds", async () => {
    expect(await popularSelectionsCardSO.runnerName(firstSelection).getText()).toEqual("Sundowns");
    expect(await popularSelectionsCardSO.marketName(firstSelection).getText()).toEqual("Full Time Result");
    expect(await popularSelectionsCardSO.betButtonOdd(firstSelection).getText()).toEqual("2.5");
  });

  it("[PRPI-9394] The second selection should display the correct runner and market names and odds", async () => {
    expect(await popularSelectionsCardSO.runnerName(secondSelection).getText()).toEqual("Arsenal");
    expect(await popularSelectionsCardSO.marketName(secondSelection).getText()).toEqual("Match Odds");
    expect(await popularSelectionsCardSO.betButtonOdd(secondSelection).getText()).toEqual("1.8");
  });

  it("[PRPI-9395] The third selection should display the correct runner and market names and odds", async () => {
    expect(await popularSelectionsCardSO.runnerName(thirdSelection).getText()).toEqual("Yes");
    expect(await popularSelectionsCardSO.marketName(thirdSelection).getText()).toEqual("Both Teams To Score");
    expect(await popularSelectionsCardSO.betButtonOdd(thirdSelection).getText()).toEqual("1.65");
  });

  describe("when the user clicks on the first selection bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstSelectionButton.element);
      await firstSelectionButton.element.click();
      await browser.waitUntilDisplayed(betDetailsSO.element);
    });

    it("[PRPI-9396] The betslip should be displayed with one selection", async () => {
      expect(await betDetailsSO.element.isDisplayed()).toBe(true);
    });

    describe("and then clicks on it again", () => {
      beforeAll(async () => {
        await betslipDrawerSO.header.click();
        await browser.waitUntilDisplayed(minimizedBetslipSO.element);

        await browser.waitUntilClickableNative(firstSelectionButton.element);
        await firstSelectionButton.element.click();
        await browser.waitUntilNotDisplayed(minimizedBetslipSO.element);
      });

      it("[PRPI-9398] The bets should be removed from the betslip", async () => {
        expect(await betslipDrawerSO.element.isDisplayed()).toBe(false);
      });
    });
  });
});
