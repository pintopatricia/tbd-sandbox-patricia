const {
  MyBetsPagePO,
  GenericPagePO,
  HeaderPO,
  MyBetsHeaderPO,
  ScrollableSwimlanePO,
  CardPO,
  BottomBarPO,
  AvBFixturePO,
} = require("../../../../../page-objects");
const {
  getGenericLayout,
  getEventLayout,
  getMarketLayout,
  getMyBetsLayout,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const mockService = new MockService();
const genericPagePO = new GenericPagePO();
const headerPO = new HeaderPO();
const avbFixturePO = new AvBFixturePO();
const cardPO = new CardPO();
const bottomBarPO = new BottomBarPO();
const myBetsPO = new MyBetsPagePO();
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);

const firstPrimarySwimlane = new ScrollableSwimlanePO(genericPagePO.scrollableSwimlanes[0]);

const EVENT_ID = "29359895";
const MARKET_ID = "1.160337355";

const BOTTOM_BAR = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: "browse/browse:sports",
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: routes.getMyBetsViewUrl("open"),
      },
    },
    {
      tileType: "GAMING",
      viewLink: {
        viewUrn: "ppb:tbd:view:gaming:1",
        viewUrl: "casino/gm-1",
      },
    },
  ],
};

const BFF_MOCK_MARKET_VIEW = {
  url: `/soccer/english-premier-league/chelsea-v-tottenham/match-odds/m-${MARKET_ID}`,
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  bottomBar: BOTTOM_BAR,
};

const BFF_EVENT_PAGE_MOCK = {
  url: `/football/spanish-la-liga/real-madrid-v-atletico-madrid/e-${EVENT_ID}`,
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  selectionId: 48044,
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
                  name: "Wolves",
                },
                {
                  selectionId: 48351,
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0`,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0` },
            ],
          },
        },
        viewLinks: [
          {
            viewUrn: `ppb:tbd:view:market:${MARKET_ID}`,
            viewUrl: `/soccer/english-premier-league/chelsea-v-tottenham/match-odds/m-${MARKET_ID}`,
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],

  bottomBar: BOTTOM_BAR,
};

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
        cardGroupTitle: "Today",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: `/football/brazilian-brasiliense-matches/gama-v-real-futebol-clube/e-${EVENT_ID}`,
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170181973",
                      liveData: {
                        totalMatched: 21883.006497031536,
                        state: "SUSPENDED",
                        inplay: false,
                      },
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12191691",
                          name: "Brazilian Brasiliense Matches",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753184",
                          name: "Gama v Real Futebol Clube",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/198140/0",
                          name: "Gama",
                          selectionId: 198140,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/22242266/0",
                          name: "Real Futebol Clube",
                          selectionId: 22242266,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170181973/198140/0" },
                      { runnerURN: "ppb:excRunner:1.170181973/22242266/0" },
                      { runnerURN: "ppb:excRunner:1.170181973/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753184",
                  home: {
                    name: "Gama",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Real Futebol Clube",
                    color: null,
                    crest: null,
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
              },
            },
          ],
        },
      },
    },
  ],

  bottomBar: BOTTOM_BAR,
};

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/mybets-open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["EXCHANGE", "SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  edges: [],
  pageInfo: {
    hasNextPage: "true",
    endCursor: "Mw==",
  },
  headerItems: HEADER_ITEMS_MOCK,
};

describe("Back Button", () => {
  describe("When user enters homepage", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_HOME_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(await headerPO.element);
      await browser.waitUntilEquals(firstPrimarySwimlane.title, "Today");
    });

    it("[PRPI-6610] \u200BThe back button should not be displayed", async () => {
      expect(await headerPO.backButton.isDisplayed()).toBe(false);
    });

    describe("When user navigates to an event page", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
        await avbFixturePO.element.waitForClickable();
        await avbFixturePO.element.click();
        await browser.waitUntilDisplayed(await headerPO.backButton);
        await browser.waitUntilEquals(cardPO.title, "Match Odds");
      });

      it("[PRPI-6611] The back button should be displayed", async () => {
        expect(await headerPO.backButtonIcon.isDisplayed()).toBe(true);
      });

      describe("When user taps in back button", () => {
        beforeAll(async () => {
          await headerPO.backButton.waitForClickable();
          await headerPO.backButton.click();
          await browser.waitUntilEquals(firstPrimarySwimlane.title, "Today");
        });

        it("[PRPI-6612] The homepage should be displayed", async () => {
          expect((await browser.getUrl()).endsWith("/betting/")).toBe(true);
          expect(await firstPrimarySwimlane.title.getText()).toBe("Today");
        });

        it("[PRPI-6613] The back button should not be displayed", async () => {
          expect(await headerPO.backButton.isDisplayed()).toBe(false);
        });
      });
    });
  });

  describe("When user enters directly on an event page (first render)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_EVENT_PAGE_MOCK.urn, { currentUrl: BFF_EVENT_PAGE_MOCK.url }),
      );
      await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.refresh();
      await browser.waitUntilEquals(cardPO.title, "Match Odds");
    });

    it("[PRPI-6614] The event page should be displayed", async () => {
      expect(await cardPO.title.getText()).toBe("Match Odds");
    });

    it("[PRPI-6615] The back button should not be displayed", async () => {
      expect(await headerPO.backButton.isDisplayed()).toBe(false);
    });

    describe("When user taps to enter market view", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_MARKET_VIEW));
        await cardPO.title.waitForClickable();
        await cardPO.title.click();
        await browser.waitUntilDisplayed(await headerPO.backButtonIcon);
      });

      it("[PRPI-6616] The back button should be displayed", async () => {
        expect(await headerPO.backButtonIcon.isDisplayed()).toBe(true);
      });

      describe("When user taps in back button", () => {
        beforeAll(async () => {
          await headerPO.backButton.waitForClickable();
          await headerPO.backButton.click();
          await browser.waitUntilEquals(cardPO.title, "Match Odds");
        });

        it("[PRPI-6617] The event page should be displayed", async () => {
          expect(await cardPO.title.getText()).toBe("Match Odds");
        });

        it("[PRPI-6618] The back button should not be displayed", async () => {
          expect(await headerPO.backButtonIcon.isDisplayed()).toBe(false);
        });

        describe("When user taps to enter market view and taps to go to my bets page", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
            await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
            await cardPO.title.waitForClickable();
            await cardPO.title.click();
            await browser.waitUntilDisplayed(await headerPO.backButton);
            await bottomBarPO.myBetsTile.waitForClickable();
            await bottomBarPO.myBetsTile.click();
            await browser.waitUntilEquals(myBetsHeaderPO.header, "My Bets");
          });

          it("[PRPI-6619] The my bets page should be displayed", async () => {
            expect(await browser.getUrl()).toContain("mybets/mybets-open");
            expect(await myBetsHeaderPO.header.getText()).toBe("My Bets");
          });

          it("[PRPI-6620] The back button should not be displayed", async () => {
            expect(await headerPO.backButtonIcon.isDisplayed()).toBe(false);
          });
        });
      });
    });
  });
});
