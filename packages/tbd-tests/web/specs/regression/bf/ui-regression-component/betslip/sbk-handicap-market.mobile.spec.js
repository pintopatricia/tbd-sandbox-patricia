const { MarketPagePO, SportsbookMarketPO, RunnerPO, TabsGroupPO } = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const marketPagePO = new MarketPagePO();
const tabsPO = new TabsGroupPO();
const sportsbookMarketPO = new SportsbookMarketPO(marketPagePO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const secondRunnerPO = new RunnerPO(sportsbookMarketPO.runnerList[1]);
const thirdRunnerPO = new RunnerPO(sportsbookMarketPO.runnerList[2]);

const mockService = new MockService();

const FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:30431869|viewLink",
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:30431869",
    },
    fixture: {
      urn: "ppb:fixture:30431869",
      home: {
        name: "Villarreal",
      },
      away: {
        name: "Arsenal",
      },
    },
  },
};

const SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.26098",
  name: "Alternative Handicaps",
  marketType: "MATCH_HANDICAP_WITH_TIE",
  marketTypeName: null,
  bettingType: "MOVING_HANDICAP",
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:30431869",
      name: "Villarreal v Arsenal",
    },
  },
  runners: [
    {
      __typename: "Runner",
      runnerURN: "ppb:sbkRunner:924.26098/28191",
      name: "Villarreal",
      selectionId: 28191,
      handicap: "-2",
      resultType: "HOME",
    },
    {
      __typename: "Runner",
      runnerURN: "ppb:sbkRunner:924.26098/12453909",
      name: "Handicap Draw",
      selectionId: 12453909,
      handicap: "-2",
      resultType: "LINE",
    },
    {
      __typename: "Runner",
      runnerURN: "ppb:sbkRunner:924.26098/1096",
      name: "Arsenal",
      selectionId: 1096,
      handicap: 2,
      resultType: "AWAY",
    },
  ],
};

const MARKET_EXTENDED_CARD = {
  node: {
    __typename: "MarketExtendedCard",
    urn: "ppb:tbd:card:marketExtended:924.26098|false",
    cardTitle: "Alternative Handicaps",
    displayRunners: {
      exchange: null,
      sportsbook: {
        market: SPORTSBOOK_MARKET,
        runners: [
          {
            runnerURN: "ppb:sbkRunner:924.26098/28191",
          },
          {
            runnerURN: "ppb:sbkRunner:924.26098/12453909",
          },
          {
            runnerURN: "ppb:sbkRunner:924.26098/1096",
          },
        ],
      },
    },
    cashoutQuotes: null,
  },
};

const BFF_MARKET_VIEW_MOCK = {
  __typename: "MarketView",
  urn: "ppb:tbd:view:market:924.26098",
  url: "football/uefa-europa-league/villarreal-v-arsenal/alternative-handicaps/r-924.26098",
  mainMarket: SPORTSBOOK_MARKET,
  edges: [FIXTURE, MARKET_EXTENDED_CARD],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: 924.26098,
      bettingType: "MOVING_HANDICAP",
      runnerDetails: [
        {
          selectionId: 28191,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: -2,
        },
        {
          selectionId: 12453909,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: -2,
        },
        {
          selectionId: 1096,
          noOdds: true,
          handicap: 2,
        },
      ],
    },
  ],
};

const SMP_MOCK_HANDICAP_UPDATE = {
  markets: [
    {
      marketId: 924.26098,
      bettingType: "MOVING_HANDICAP",
      runnerDetails: [
        {
          selectionId: 28191,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: -1,
        },
        {
          selectionId: 12453909,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: 1,
        },
        {
          selectionId: 1096,
          noOdds: true,
          handicap: -2,
        },
      ],
    },
  ],
};

describe("SBK: Handicap Market Card", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MARKET_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMarketLayout(BFF_MARKET_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await browser.url(routes.getMarketViewUrl("924.26098"));
    await browser.waitUntilDisplayed(marketPagePO.marketTitle, "Alternative Handicaps");
  });

  describe("When the user opens a market view for an handicap market", () => {
    it("[PRPI-5616] Should not show SBK market tab", async () => {
      expect(await tabsPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-5617] Should show the correct market name", async () => {
      expect(await marketPagePO.marketTitle.getText()).toBe("Alternative Handicaps");
    });

    it("[PRPI-5618] Should show the correct runner name with the respective handicap value", async () => {
      expect(await firstRunnerPO.runnerName.getText()).toBe("Villarreal (-2)");
      expect(await secondRunnerPO.runnerName.getText()).toBe("Handicap Draw (-2)");
      expect(await thirdRunnerPO.runnerName.getText()).toBe("Arsenal (+2)");
    });

    describe("When there's an update of the handicap values", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_HANDICAP_UPDATE));
        await browser.tickFakeClock();
        await browser.waitUntilDisplayed(marketPagePO.marketTitle, "Alternative Handicaps");
      });

      it("[PRPI-5619] Should show the correct runners names with the updated handicap values", async () => {
        expect(await firstRunnerPO.runnerName.getText()).toBe("Villarreal (-1)");
        expect(await secondRunnerPO.runnerName.getText()).toBe("Handicap Draw (+1)");
        expect(await thirdRunnerPO.runnerName.getText()).toBe("Arsenal (-2)");
      });
    });
  });
});
