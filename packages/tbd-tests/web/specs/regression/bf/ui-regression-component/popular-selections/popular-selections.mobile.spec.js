const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const {
  BetDetailsPO,
  BetslipDrawerPO,
  CardPO,
  MinimizedPO,
  SportsbookBetButtonPO,
  PopularSelectionsCardPO,
} = require("../../../../../page-objects");
const {
  getSportsLayout,
  getMarkets,
  getQuerySportsbookBetButtonResponse,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const popularSelectionsCardPO = new PopularSelectionsCardPO();
const cardPO = new CardPO();
const betslipDrawerPO = new BetslipDrawerPO();
const minimizedBetslipPO = new MinimizedPO();
const betDetailsPO = new BetDetailsPO();
const firstSelection = popularSelectionsCardPO.selectionItems[0];
const secondSelection = popularSelectionsCardPO.selectionItems[1];
const thirdSelection = popularSelectionsCardPO.selectionItems[2];
const firstSelectionButton = new SportsbookBetButtonPO(popularSelectionsCardPO.betButton(firstSelection));

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
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getQuerySportsbookBetButtonResponse(RUNNER_MOCK_1));
    await mockService.mockHttpRequest(getQuerySportsbookBetButtonResponse(RUNNER_MOCK_2));
    await mockService.mockHttpRequest(getQuerySportsbookBetButtonResponse(RUNNER_MOCK_3));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
    await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(popularSelectionsCardPO.element);
    await browser.waitUntilEquals(cardPO.title, "Popular");
  });

  it("[PRPI-9391] The popular selections card should be displayed", async () => {
    expect(await popularSelectionsCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-9392] Should display three selection items", async () => {
    expect(await popularSelectionsCardPO.selectionItems.length).toBe(3);
  });

  it("[PRPI-9393] The first selection should display the correct runner and market names and odds", async () => {
    expect(await popularSelectionsCardPO.runnerName(firstSelection).getText()).toEqual("Sundowns");
    expect(await popularSelectionsCardPO.marketName(firstSelection).getText()).toEqual("Full Time Result");
    expect(await popularSelectionsCardPO.betButtonOdd(firstSelection).getText()).toEqual("2.5");
  });

  it("[PRPI-9394] The second selection should display the correct runner and market names and odds", async () => {
    expect(await popularSelectionsCardPO.runnerName(secondSelection).getText()).toEqual("Arsenal");
    expect(await popularSelectionsCardPO.marketName(secondSelection).getText()).toEqual("Match Odds");
    expect(await popularSelectionsCardPO.betButtonOdd(secondSelection).getText()).toEqual("1.8");
  });

  it("[PRPI-9395] The third selection should display the correct runner and market names and odds", async () => {
    expect(await popularSelectionsCardPO.runnerName(thirdSelection).getText()).toEqual("Yes");
    expect(await popularSelectionsCardPO.marketName(thirdSelection).getText()).toEqual("Both Teams To Score");
    expect(await popularSelectionsCardPO.betButtonOdd(thirdSelection).getText()).toEqual("1.65");
  });

  describe("when the user clicks on the first selection bet button", () => {
    beforeAll(async () => {
      await firstSelectionButton.element.click();
      await browser.waitUntilDisplayed(betslipDrawerPO.element);
    });

    it("[PRPI-9396] The betslip should be displayed with one selection", async () => {
      expect(await betDetailsPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-9397] The bet button should have the selected state", async () => {
      expect(await browser.containsClass(firstSelectionButton.element, SportsbookBetButtonPO.states.selected)).toBe(
        true,
      );
    });

    describe("and then clicks on it again", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(minimizedBetslipPO.element);

        await firstSelectionButton.element.click();
        await browser.waitUntilNotDisplayed(minimizedBetslipPO.element);
      });

      it("[PRPI-9398] The bets should be removed from the betslip", async () => {
        expect(await betslipDrawerPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-9399] The bet button should not have the selected state", async () => {
        expect(await browser.containsClass(firstSelectionButton.element, SportsbookBetButtonPO.states.selected)).toBe(
          false,
        );
      });
    });
  });
});
