const {
  MarketPagePO,
  EventPagePO,
  ExchangeMarketPO,
  AppPO,
  CardPO,
  RunnerPO,
  MarketBlurbsPO,
  MarketDepthButtonPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;

const { getMarketLayout, getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const marketPagePO = new MarketPagePO();
const marketDepthButtonPO = new MarketDepthButtonPO();

const correctScoreCardPO = new CardPO(eventPagePO.markets[1]);
const marketCardPO = new CardPO(marketPagePO.market);
const exchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);
const marketBlurbsPO = new MarketBlurbsPO(marketCardPO.exchangeMarket);
const firstRunnerPO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const secondRunnerPO = new RunnerPO(exchangeMarketPO.runnerList[1]);
const thirdRunnerPO = new RunnerPO(exchangeMarketPO.runnerList[2]);

const mockService = new MockService();

const EXCHANGE_MATCH_ODDS_MARKET_ID = "1.123456789";
const EXCHANGE_CORRECT_SCORE_MARKET_ID = "1.987654321";
const EVENT_ID = "29682729";
const MARKET_CARD = {
  __typename: "MarketCard",
  urn: `ppb:tbd:card:market:${EXCHANGE_CORRECT_SCORE_MARKET_ID}`,
};

const MARKET_CARD_EXTENDED = {
  __typename: "MarketExtendedCard",
  urn: `ppb:tbd:card:marketExtended:${EXCHANGE_CORRECT_SCORE_MARKET_ID}`,
};

const FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
    sportevent: { urn: `ppb:event:${EVENT_ID}` },
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      home: { name: "Man Utd" },
      away: { name: "Wolves" },
    },
  },
};

const EXCHANGE_CORRECT_SCORE_MARKET = {
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_CORRECT_SCORE_MARKET_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  runners: [
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_CORRECT_SCORE_MARKET_ID}/55190/0`,
      selectionId: 55190,
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_CORRECT_SCORE_MARKET_ID}/48224/0`,
      selectionId: 48224,
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_CORRECT_SCORE_MARKET_ID}/58805/0`,
      selectionId: 58805,
    },
  ],
};

const CORRECT_SCORE_MARKET_CARD = {
  node: {
    cardTitle: "Correct Score",
    viewLinks: [
      {
        viewUrn: `ppb:tbd:view:market:${EXCHANGE_CORRECT_SCORE_MARKET_ID}`,
        viewUrl: routes.getMarketViewUrl(EXCHANGE_CORRECT_SCORE_MARKET_ID),
      },
    ],

    displayRunners: {
      exchange: {
        market: EXCHANGE_CORRECT_SCORE_MARKET,
        runners: [
          { runnerURN: `ppb:excRunner:${EXCHANGE_CORRECT_SCORE_MARKET_ID}/55190/0` },
          { runnerURN: `ppb:excRunner:${EXCHANGE_CORRECT_SCORE_MARKET_ID}/48224/0` },
          { runnerURN: `ppb:excRunner:${EXCHANGE_CORRECT_SCORE_MARKET_ID}/58805/0` },
        ],
      },
    },
  },
};

const EXCHANGE_MATCH_ODDS_MARKET = {
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  runners: [
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/55190/0`,
      selectionId: 55190,
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/48224/0`,
      selectionId: 48224,
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/58805/0`,
      selectionId: 58805,
    },
  ],
};

const MATCH_ODDS_MARKET_CARD = {
  node: {
    title: "Match Odds",
    displayRunners: {
      exchange: {
        market: EXCHANGE_MATCH_ODDS_MARKET,
        runners: [
          { runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/55190/0` },
          { runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/48224/0` },
          { runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/58805/0` },
        ],
      },
    },
  },
};

const QUICK_LINKS_CARD = {
  node: {
    __typename: "QuickLinksCard",
    urn: `ppb:tbd:card:quickLinks:view:event|${EVENT_ID}`,
    quickLinksTitle: null,
    links: [
      {
        label: "Man Utd v Wolves",
        target: "_self",
        icon: null,
        viewLink: {
          viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
          viewUrl: routes.getEventViewUrl(EVENT_ID),
        },
      },
    ],
  },
};

const BFF_MATCH_ODDS_MARKET_PAGE_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  mainMarket: EXCHANGE_MATCH_ODDS_MARKET,
  edges: [FIXTURE, { ...MATCH_ODDS_MARKET_CARD, MARKET_CARD_EXTENDED }, QUICK_LINKS_CARD],
};

const BFF_CORRECT_SCORE_MARKET_PAGE_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${EXCHANGE_CORRECT_SCORE_MARKET_ID}`,
  mainMarket: EXCHANGE_CORRECT_SCORE_MARKET,
  edges: [FIXTURE, { ...CORRECT_SCORE_MARKET_CARD, MARKET_CARD_EXTENDED }, QUICK_LINKS_CARD],
};

const BFF_EVENT_PAGE_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Man Utd v Wolves",
  },
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:marketsByEventAndMarketType:matchOddsMarketGroup|${EVENT_ID}`,
        cardGroupTitle: "Match Odds",
        full: {
          edges: [{ ...MATCH_ODDS_MARKET_CARD, MARKET_CARD }],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:29436223",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup|${EVENT_ID}`,
        cardGroupTitle: "Correct Score",
        full: {
          edges: [{ ...CORRECT_SCORE_MARKET_CARD, MARKET_CARD }],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:29436223",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:marketsByEventAndMarketType:matchOddsMarketGroup|${EVENT_ID}`,
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:marketsByEventAndMarketType:correctScoreMarketGroup|${EVENT_ID}`,
      },
    },
  ],
};

const ERO_RUNNERS_MOCK = [
  {
    selectionId: "55190",
    availableToBack: [
      { price: 2.5, size: 100 },
      { price: 2.3, size: 90 },
      { price: 2.1, size: 80 },
    ],

    availableToLay: [
      { price: 5.8, size: 110 },
      { price: 7, size: 120 },
      { price: 8, size: 130 },
    ],
  },
  {
    selectionId: "48224",
    availableToBack: [
      { price: 3.5, size: 100 },
      { price: 3.3, size: 90 },
      { price: 3.1, size: 80 },
    ],

    availableToLay: [
      { price: 6.8, size: 110 },
      { price: 8, size: 120 },
      { price: 9, size: 130 },
    ],
  },
  {
    selectionId: "58805",
    availableToBack: [
      { price: 1.5, size: 100 },
      { price: 1.3, size: 90 },
      { price: 1.1, size: 80 },
    ],

    availableToLay: [
      { price: 1.8, size: 110 },
      { price: 2, size: 120 },
      { price: 3, size: 130 },
    ],
  },
];

const MATCH_ODDS_ERO_MOCK = [
  {
    marketId: EXCHANGE_MATCH_ODDS_MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

const CORRECT_SCORE_ERO_MOCK = [
  {
    marketId: EXCHANGE_CORRECT_SCORE_MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

describe("Exchange Market Page - Market Depth Persistence", () => {
  describe("When the user is on Match Odds EXC tab´s market view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MATCH_ODDS_MARKET_PAGE_MOCK.urn));
      await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: "2.5" }));
    });

    describe("And the user clicks in the market depth button to expand it", () => {
      beforeAll(async () => {
        await marketDepthButtonPO.element.click();
        await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: "2.1" }));
      });

      describe("And the user clicks in the event link and goes to the Correct Score market", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));

          await marketPagePO.quickLink.scrollIntoView();
          await marketPagePO.quickLink.click();

          await browser.waitUntilDisplayed(eventPagePO.scrollableSwimlanes[0]);

          await mockService.mockHttpRequest(getMarkets(CORRECT_SCORE_ERO_MOCK));
          await mockService.mockHttpRequest(getMarketLayout(BFF_CORRECT_SCORE_MARKET_PAGE_MOCK));

          await correctScoreCardPO.element.scrollIntoView();
          await correctScoreCardPO.title.click();

          await browser.waitUntil(
            AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: "2.1" }),
          );
        });

        it("[PRPI-5414] the market depth button should be visible on the viewport", async () => {
          expect(await marketDepthButtonPO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-5414] the market depth book percentage should be visible", async () => {
          expect(await marketBlurbsPO.bookPercentage.isDisplayed()).toBe(true);
        });

        it("[PRPI-5414] the top 3 available back and lay prices for each runner should be visible on the viewport", async () => {
          expect(await firstRunnerPO.exchangeBetButtons.length).toBe(6);
          expect(await secondRunnerPO.exchangeBetButtons.length).toBe(6);
          expect(await thirdRunnerPO.exchangeBetButtons.length).toBe(6);
        });
      });
    });
  });
});
