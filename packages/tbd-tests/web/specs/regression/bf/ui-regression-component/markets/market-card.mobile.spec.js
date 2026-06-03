const { GenericPagePO, MarketPagePO, CardPO } = require("../../../../../page-objects");
const { getGenericLayout, getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../../utils/routes");
const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const genericPagePO = new GenericPagePO();
const marketPagePO = new MarketPagePO();

const firstMarketCardPO = new CardPO(genericPagePO.genericViewCards[0]);
const secondMarketCardPO = new CardPO(genericPagePO.genericViewCards[1]);
const marketPageCardPO = new CardPO(marketPagePO.element);

const marketCardSbk = {
  urn: "ppb:tbd:card:29436223:MATCH_ODDS",
  __typename: "MarketCard",
  cardTitle: "Win",
  displayRunners: {
    sportsbook: {
      market: {
        __typename: "SportsbookMarket",
        urn: "ppb:sbkMarket:924.193270252",
        notTotalMatched: true,
        name: "Match Odds",
        hierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "Wolves v Man Utd",
            urn: "ppb:event:29359895",
          },
        },
        runners: [
          {
            runnerURN: "ppb:sbkRunner:924.193270252/48044",
            selectionId: 48044,
            name: "Wolves",
          },
        ],
      },
      runners: [{ runnerURN: "ppb:sbkRunner:924.193270252/48044" }],
    },
  },
  viewLinks: [
    {
      viewUrn: "ppb:tbd:view:market:1.160337355",
      viewUrl: routes.getMarketViewUrl("1.160337355"),
    },
    {
      viewUrn: "ppb:tbd:view:market:924.193270252",
      viewUrl: routes.getMarketViewUrl("924.193270252"),
    },
  ],
};

const marketCardExc = {
  urn: "ppb:tbd:card:29436223:MATCH_ODDS",
  __typename: "MarketCard",
  cardTitle: "Win",
  displayRunners: {
    exchange: {
      market: {
        __typename: "ExchangeMarket",
        urn: "ppb:excMarket:1.160337355",
        name: "Match Odds",
        hierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "Wolves v Man Utd",
            urn: "ppb:event:29359895",
          },
        },
        runners: [
          {
            runnerURN: "ppb:excRunner:1.160337355/48044/0",
            selectionId: 48044,
            name: "Wolves",
          },
        ],
      },
      runners: [{ runnerURN: "ppb:excRunner:1.160337355/48044/0" }],
    },
  },
  viewLinks: [
    {
      viewUrn: "ppb:tbd:view:market:1.160337355",
      viewUrl: routes.getMarketViewUrl("1.160337355"),
    },
    {
      viewUrn: "ppb:tbd:view:market:924.193270252",
      viewUrl: routes.getMarketViewUrl("924.193270252"),
    },
  ],
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        ...marketCardSbk,
      },
    },
    {
      node: {
        ...marketCardExc,
        urn: "ppb:tbd:card:29436221:MATCH_ODDS",
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:1.160337355",
            viewUrl: routes.getMarketViewUrl("1.160337355"),
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436221:MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],
};

const BFF_MOCK_MARKET_VIEW = {
  url: "football/spanish-la-liga/real-madrid-v-atletico-madrid/anytime-correct-score/rc-1.160337355",
  urn: "ppb:tbd:view:market:1.160337355",
  mainMarket: { urn: "ppb:excMarket:1.160337355" },
  edges: [
    {
      node: {
        ...marketCardExc,
      },
    },
  ],
};

describe("Layout Entity - Market Card", () => {
  describe("When the user is on a given page and 2 marketcards are retrieved with viewLinks for EXC and SBK markets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_MARKET_VIEW));
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilEquals(firstMarketCardPO.title, "Win");
    });

    it("[PRPI-6124] The 1st marketcard should be rendered", async () => {
      expect(await firstMarketCardPO.element.isDisplayed()).toBe(true);
    });

    describe("When the user scrolls to the 2nd marketcard", () => {
      beforeAll(async () => {
        await secondMarketCardPO.element.scrollIntoView({ block: "end" });
      });

      it("[PRPI-8377] The 2nd marketcard should be rendered", async () => {
        expect(await secondMarketCardPO.element.isDisplayed()).toBe(true);
      });

      describe("When the user taps the Exchange market title", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(marketPagePO.element);
          await secondMarketCardPO.title.waitForClickable();
          await secondMarketCardPO.title.click();
        });

        it("[PRPI-8378] The market view should be visible with title 'Win'", async () => {
          expect(await marketPagePO.element.isDisplayed()).toBe(true);
          expect(await marketPageCardPO.title.getText()).toBe("Win");
        });
      });
    });
  });
});
