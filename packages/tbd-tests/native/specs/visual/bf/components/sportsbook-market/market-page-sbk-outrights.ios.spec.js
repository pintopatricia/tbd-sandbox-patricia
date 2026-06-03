const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getMarketLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const mockService = new MockService();
const SPORTSBOOK_MARKET_ID = "924.222615412";
const URN = `ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`;

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.0 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.4 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

const SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
  name: "Premier League Winner 2022/23",
  marketType: "WINNER",
  bettingType: "ODDS",
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:2022802",
      eventId: 2022802,
      name: "English Premier League",
      openDate: "2022-10-02T18:18:03.000Z",
      competition: {
        __typename: "Competition",
        urn: "ppb:competition:10932509",
        name: "English Premier League",
        competitionId: 10932509,
        sport: {
          __typename: "Sport",
          urn: "ppb:eventType:1",
          name: "Football",
          sportId: 1,
        },
      },
    },
    competition: {
      __typename: "Competition",
      urn: "ppb:competition:10932509",
      name: "English Premier League",
      competitionId: 10932509,
      sport: {
        __typename: "Sport",
        urn: "ppb:eventType:1",
        name: "Football",
        sportId: 1,
      },
    },
  },
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:1",
    name: "Football",
    sportId: 1,
  },
  runners: [
    {
      runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/1`,
      name: "Benfica",
      selectionId: 1,
    },
    {
      runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/2`,
      name: "Liverpool",
      selectionId: 2,
    },
    {
      runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/3`,
      name: "Petrol FC",
      selectionId: 3,
    },
  ],
};

const MARKET_EXTENDED_CARD = {
  node: {
    __typename: "MarketExtendedCard",
    urn: `ppb:tbd:card:marketExtended:${SPORTSBOOK_MARKET_ID}|false`,
    cardTitle: "Premier League Winner 2022/23",
    displayRunners: {
      sportsbook: {
        market: SPORTSBOOK_MARKET,
        runners: [
          { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/1` },
          { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/2` },
          { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/3` },
        ],
      },
    },
    runnerViewLinks: [],
  },
};

const SWITCHER_CARD = {
  node: {
    __typename: "GenericSwitcherCard",
    urn: `ppb:tbd:card:genericswitcher:market:${SPORTSBOOK_MARKET_ID}`,
    filterTitle: {
      translated: null,
      translate: {
        key: "I18N.SWITCHER.SPORT.TITLE",
      },
    },
    selectedViewLink: {
      label: "Winner 2022/23",
      viewLink: {
        viewUrn: URN,
        viewUrl: `football/english-premier-league/winner-2022-23/mwe-${SPORTSBOOK_MARKET_ID}`,
      },
    },
  },
};

const BFF_MOCK = {
  urn: URN,
  mainMarket: SPORTSBOOK_MARKET,
  edges: [SWITCHER_CARD, MARKET_EXTENDED_CARD],
};

const MODULE_NAME = "market_page";

describe("Sportsbook Market Without Event Page", () => {
  describe("when the market page is loaded", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketLayout(SPORTSBOOK_MARKET_ID));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [SWITCHER_CARD.node] }));

      const HOME_VIEW_LINK = getStartViewLink(`sport/competition/market/mwe-${SPORTSBOOK_MARKET_ID}`);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4440]_should_render_sbk_market_without_event_page`);
    });

    it("[PRPI-4440]_should_render_sbk_market_without_event_page", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4440]_should_render_sbk_market_without_event_page`))
          .misMatchPercentage,
      ).toBe(0);
    });
  });
});
