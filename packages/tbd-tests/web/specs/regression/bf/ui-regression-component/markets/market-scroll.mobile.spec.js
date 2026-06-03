const { EventPagePO, AppPO, ExchangeMarketPO, CardPO, RunnerPO } = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const secondCardPO = new CardPO(eventPagePO.markets[1]);
const thirdCardPO = new CardPO(eventPagePO.markets[2]);
const fourthCardPO = new CardPO(eventPagePO.markets[3]);
const fifthCardPO = new CardPO(eventPagePO.markets[4]);
const sixthCardPO = new CardPO(eventPagePO.markets[5]);
const exchangeMarketPO = new ExchangeMarketPO(fourthCardPO.exchangeMarket);
const lastRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[9]);

const mockService = new MockService();

const EVENT_ID = "29359895";

const ERO_MOCK = [
  {
    marketId: "1.160337355",
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 3.21, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 3.1, size: 300 }],
        availableToLay: [{ price: 3.2, size: 310 }],
      },
    ],
  },
  {
    marketId: "1.160337366",
    runners: [...Array(10)].fill({ availableToBack: [{}], availableToLay: [{}] }),
  },
  {
    marketId: "1.123",
    runners: [...Array(3)].fill({ availableToBack: [{}], availableToLay: [{}] }),
  },
  {
    marketId: "1.1603373661",
    runners: [...Array(10)].fill({ availableToBack: [{ price: 1.23, size: 10 }], availableToLay: [{}] }),
  },
  {
    marketId: "1.160337356",
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 3.1, size: 300 }],
        availableToLay: [{ price: 3.2, size: 310 }],
      },
    ],
  },
];

const BFF_MOCK = {
  nextPageCursor: "nextCursor",
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        cardTitle: "Match Odds",
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
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337355/48044/0",
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/48351/0",
                  selectionId: 48351,
                  name: "Man Utd",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/58805/0",
                  selectionId: 58805,
                  name: "The Draw",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
              { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
              { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        cardTitle: "Correct Score",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337366",
              name: "Correct Score",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337366/1/0",
                  selectionId: 1,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/2/0",
                  selectionId: 2,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/3/0",
                  selectionId: 3,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/4/0",
                  selectionId: 4,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/5/0",
                  selectionId: 5,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/6/0",
                  selectionId: 6,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/7/0",
                  selectionId: 7,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/8/0",
                  selectionId: 8,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/9/0",
                  selectionId: 9,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/10/0",
                  selectionId: 10,
                  name: "0 - 9",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337366/1/0" },
              { runnerURN: "ppb:excRunner:1.160337366/2/0" },
              { runnerURN: "ppb:excRunner:1.160337366/3/0" },
              { runnerURN: "ppb:excRunner:1.160337366/4/0" },
              { runnerURN: "ppb:excRunner:1.160337366/5/0" },
              { runnerURN: "ppb:excRunner:1.160337366/6/0" },
              { runnerURN: "ppb:excRunner:1.160337366/7/0" },
              { runnerURN: "ppb:excRunner:1.160337366/8/0" },
              { runnerURN: "ppb:excRunner:1.160337366/9/0" },
              { runnerURN: "ppb:excRunner:1.160337366/10/0" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:294362231:MATCH_ODDS",
        cardTitle: "Match Odds 2",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337356",
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337356/48044/0",
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337356/48351/0",
                  selectionId: 48351,
                  name: "Man Utd",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337356/58805/0",
                  selectionId: 58805,
                  name: "The Draw",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337356/48044/0" },
              { runnerURN: "ppb:excRunner:1.160337356/48351/0" },
              { runnerURN: "ppb:excRunner:1.160337356/58805/0" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:2943622311:CORRECT_SCORE",
        cardTitle: "Correct Score 2",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337367",
              name: "Correct Score",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337367/1/0",
                  selectionId: 1,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337367/2/0",
                  selectionId: 2,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337367/3/0",
                  selectionId: 3,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337367/4/0",
                  selectionId: 4,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337367/5/0",
                  selectionId: 5,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337367/6/0",
                  selectionId: 6,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337367/7/0",
                  selectionId: 7,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337367/8/0",
                  selectionId: 8,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337367/9/0",
                  selectionId: 9,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337367/10/0",
                  selectionId: 10,
                  name: "0 - 9",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337367/1/0" },
              { runnerURN: "ppb:excRunner:1.160337367/2/0" },
              { runnerURN: "ppb:excRunner:1.160337367/3/0" },
              { runnerURN: "ppb:excRunner:1.160337367/4/0" },
              { runnerURN: "ppb:excRunner:1.160337367/5/0" },
              { runnerURN: "ppb:excRunner:1.160337367/6/0" },
              { runnerURN: "ppb:excRunner:1.160337367/7/0" },
              { runnerURN: "ppb:excRunner:1.160337367/8/0" },
              { runnerURN: "ppb:excRunner:1.160337367/9/0" },
              { runnerURN: "ppb:excRunner:1.160337367/10/0" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:294362231:MATCH_ODDS",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:2943622311:CORRECT_SCORE",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:2943622312:MATCH_ODDS",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223112:CORRECT_SCORE",
      },
    },
  ],
};

const CARDS_MOCK = {
  cards: [
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:2943622312:MATCH_ODDS",
      cardTitle: "Match Odds 3",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.123",
            name: "Match Odds 2",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                name: "Pinhol v Liverpool",
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                runnerURN: "ppb:excRunner:1.123/1/0",
                selectionId: 1,
                name: "Pinhol",
              },
              {
                runnerURN: "ppb:excRunner:1.123/2/0",
                selectionId: 2,
                name: "Liverpool",
              },
              {
                runnerURN: "ppb:excRunner:1.123/3/0",
                selectionId: 3,
                name: "The Draw",
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:excRunner:1.123/1/0" },
            { runnerURN: "ppb:excRunner:1.123/2/0" },
            { runnerURN: "ppb:excRunner:1.123/3/0" },
          ],
        },
      },
    },
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:29436223112:CORRECT_SCORE",
      cardTitle: "Correct Score 3",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.1603373661",
            name: "Correct Score 2",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                name: "Pinhol v Liverpool",
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                runnerURN: "ppb:excRunner:1.1603373661/1/0",
                selectionId: 1,
              },
              {
                runnerURN: "ppb:excRunner:1.1603373661/2/0",
                selectionId: 2,
              },
              {
                runnerURN: "ppb:excRunner:1.1603373661/3/0",
                selectionId: 3,
              },
              {
                runnerURN: "ppb:excRunner:1.1603373661/4/0",
                selectionId: 4,
              },
              {
                runnerURN: "ppb:excRunner:1.1603373661/5/0",
                selectionId: 5,
              },
              {
                runnerURN: "ppb:excRunner:1.1603373661/6/0",
                selectionId: 6,
              },
              {
                runnerURN: "ppb:excRunner:1.1603373661/7/0",
                selectionId: 7,
              },
              {
                runnerURN: "ppb:excRunner:1.1603373661/8/0",
                selectionId: 8,
              },
              {
                runnerURN: "ppb:excRunner:1.1603373661/9/0",
                selectionId: 9,
              },
              {
                runnerURN: "ppb:excRunner:1.1603373661/10/0",
                selectionId: 10,
                name: "9 - 9",
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:excRunner:1.1603373661/1/0" },
            { runnerURN: "ppb:excRunner:1.1603373661/2/0" },
            { runnerURN: "ppb:excRunner:1.1603373661/3/0" },
            { runnerURN: "ppb:excRunner:1.1603373661/4/0" },
            { runnerURN: "ppb:excRunner:1.1603373661/5/0" },
            { runnerURN: "ppb:excRunner:1.1603373661/6/0" },
            { runnerURN: "ppb:excRunner:1.1603373661/7/0" },
            { runnerURN: "ppb:excRunner:1.1603373661/8/0" },
            { runnerURN: "ppb:excRunner:1.1603373661/9/0" },
            { runnerURN: "ppb:excRunner:1.1603373661/10/0" },
          ],
        },
      },
    },
  ],
};

describe("Pagination on Event View", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getCardResults(CARDS_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK, { hasRequestedNewMarkets: true }));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(eventPagePO.element);
    await browser.waitUntil(async () => (await eventPagePO.markets.length) === 6);
  });

  it("[PRPI-6176] there should be 6 markets visible", async () => {
    expect(await eventPagePO.markets.length).toBe(6);
  });

  it("[PRPI-6177] the first market is 'Match Odds'", async () => {
    expect(await firstCardPO.title.getText()).toBe("Match Odds");
  });

  it("[PRPI-6178] the second market is 'Correct Score'", async () => {
    expect(await secondCardPO.title.getText()).toBe("Correct Score");
  });

  it("[PRPI-6179] the third market is 'Match Odds 2'", async () => {
    expect(await thirdCardPO.title.getText()).toBe("Match Odds 2");
  });

  it("[PRPI-6180] the fourth market is 'Correct Score 2'", async () => {
    expect(await fourthCardPO.title.getText()).toBe("Correct Score 2");
  });

  it("[PRPI-6181] the second market has 10 runners", async () => {
    expect(await exchangeMarketPO.runnerList.length).toBe(10);
  });

  it("[PRPI-6182] the last runner is '0 - 9'", async () => {
    expect(await lastRunnerExchangePO.runnerName.getText()).toBe("0 - 9");
  });

  it("[PRPI-6183] the first runner has a back of 3.21", async () => {
    await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 3.21 }));
  });

  describe("user scrolls to the bottom of the page", () => {
    beforeAll(async () => {
      await lastRunnerExchangePO.element.scrollIntoView();
      await browser.waitUntilDisplayed(eventPagePO.markets[5]);
    });

    it("[PRPI-6184] there are now 6 markerts on the page", async () => {
      expect(await eventPagePO.markets.length).toBe(6);
    });

    it("[PRPI-6185] the first market is 'Match Odds'", async () => {
      expect(await firstCardPO.title.getText()).toBe("Match Odds");
    });

    it("[PRPI-6186] the second market is 'Correct Score'", async () => {
      expect(await secondCardPO.title.getText()).toBe("Correct Score");
    });

    it("[PRPI-6187] the third market is 'Match Odds 2'", async () => {
      expect(await thirdCardPO.title.getText()).toBe("Match Odds 2");
    });

    it("[PRPI-6188] the fourth market is 'Correct Score 2'", async () => {
      expect(await fourthCardPO.title.getText()).toBe("Correct Score 2");
    });

    it("[PRPI-6189] the fifth market is 'Match Odds 3'", async () => {
      expect(await fifthCardPO.title.getText()).toBe("Match Odds 3");
    });

    it("[PRPI-6190] the sixth market is 'Correct Score 3'", async () => {
      expect(await sixthCardPO.title.getText()).toBe("Correct Score 3");
    });

    it("[PRPI-6191] the sixth market has the first runner back price of 1.23", async () => {
      await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: eventPagePO.markets[5], price: 1.23 }));
    });
  });
});
