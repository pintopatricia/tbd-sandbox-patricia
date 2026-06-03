const {
  getAppContext,
  getMyBetsLayout,
  getBrowseLayout,
  getGenericLayout,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericScreenSO, BottomBarSO, BrowseScreenSO, MyBetsScreenSO } = require("../../../../screen-objects");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK, HEADER_ITEMS_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const browseScreenSO = new BrowseScreenSO();
const myBetsScreenSO = new MyBetsScreenSO();
const EVENT_ID = "29682729";
const SPORTSBOOK_MARKET_ID = "924.222615412";

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["EXCHANGE", "SPORTSBOOK"],
      defaultIndex: 0,
    },
  },
  edges: [],
  headerItems: HEADER_ITEMS_MOCK,
};

const BFF_BROWSE_MOCK = {
  __typename: "BrowseView",
  urn: "ppb:tbd:view:browse:sports",
  url: "browse/b-sports",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
        links: [
          {
            label: "Football",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:1",
              viewUrl: "football/s-1",
            },
            target: null,
            icon: null,
          },
        ],
      },
    },
  ],
};

const BFF_BROWSE_GAMING_MOCK = {
  urn: "ppb:tbd:view:browse:gaming",
  url: "browse/b-gaming",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:azMenu:gaming",
        quickLinksTitle: null,
        links: [],
      },
    },
  ],
};

const BFF_SPORT_MOCK = {
  urn: `ppb:tbd:view:sport:1`,
  title: "Football",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                title: "Match Odds Exchange",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Wolves v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:1111`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
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
                      {
                        runnerURN: "ppb:excRunner:1.160337355/48044/0",
                      },
                      {
                        runnerURN: "ppb:excRunner:1.160337355/48351/0",
                      },
                      {
                        runnerURN: "ppb:excRunner:1.160337355/58805/0",
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const HOME_MOCK_SW_EXC = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "view/generic:home",
  hasProductSwitcher: true,
  edges: [...BFF_SPORT_MOCK.edges],
  partialEdges: [...BFF_SPORT_MOCK.partialEdges],
};

const HOME_MOCK_SW_SBK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "view/generic:home",
  hasProductSwitcher: true,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
        cardGroupTitle: null,
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
                viewLink: {
                  viewUrn: "ppb:tbd:view:event:29753184",
                  viewUrl: "ppb:tbd:view:event:29753184",
                },
                title: "Match Odds Sportsbook",
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
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: 12345,
                      urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds Sportsbook",
                      liveData: {
                        inplay: false,
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
                          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
                          name: "Gama",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
                          name: "Real Futebol Clube",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190` },
                      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224` },
                      { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/58805` },
                    ],
                  },
                },
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
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
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
      },
    },
  ],
};

describe("Navigation - Bottom Bar - Product Switcher", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        throttles: {
          PRODUCT_SWITCHER_NATIVE: {
            isActive: true,
          },
          EXC_ALLOWED_JURISDICTION: { isActive: true },
        },
        selectedExchangeDefaultProduct: "NEME",
        phoenixMigratedUser: true,
      }),
    );
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK_SW_SBK));
    await startApp("home", { dismissOnboarding: true });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilEquals(BottomBarSO.switcherLabel, "Exchange");
  });

  describe("When the user is on a Sports Page and is a single usage Sportsbook user", () => {
    it("[PRPI-8698] The last tile should display an icon and the title 'Exchange'", async () => {
      expect(await BottomBarSO.switcherLabel.getText()).toBe("Exchange");
    });

    describe("And when the user clicks on the Product Switcher", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK_SW_EXC));
        await BottomBarSO.switcher.click();
        await browser.waitUntilEquals(BottomBarSO.switcherLabel, "Sportsbook");
      });

      it("[PRPI-8699] The last tile should display an icon and the title 'Sportsbook'", async () => {
        expect(await BottomBarSO.switcherLabel.getText()).toBe("Sportsbook");
      });

      describe("And when the user clicks on the Product Switcher again", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK_SW_SBK));
          await BottomBarSO.switcher.click();
          await browser.waitUntilEquals(BottomBarSO.switcherLabel, "Exchange");
        });

        it("[PRPI-8700] The last tile should display an icon and the title 'Exchange'", async () => {
          expect(await BottomBarSO.switcherLabel.getText()).toBe("Exchange");
        });

        describe("And when the user clicks on the browse item", () => {
          beforeAll(async () => {
            await browser.waitUntilDisplayed(BottomBarSO.browse);
            await mockService.mockHttpRequest(getBrowseLayout({ ...BFF_BROWSE_MOCK, hasProductSwitcher: true }));
            await mockService.mockHttpRequest(getBrowseLayout({ ...BFF_BROWSE_GAMING_MOCK, hasProductSwitcher: true }));
            await BottomBarSO.browse.click();
            await browser.waitUntilDisplayed(browseScreenSO.element);
          });

          it("[PRPI-2811] The Product Switcher should be displayed", async () => {
            expect(await BottomBarSO.switcher.isDisplayed()).toBe(true);
          });
        });

        describe("And when the user clicks on the my bets item", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMyBetsLayout({ ...BFF_MY_BETS_MOCK, hasProductSwitcher: true }));
            await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
            await browser.waitUntilClickableNative(BottomBarSO.myBets);
            await BottomBarSO.myBets.click();
            await browser.waitUntilDisplayed(myBetsScreenSO.header);
          });

          it("[PRPI-2811] The Product Switcher should be displayed", async () => {
            expect(await BottomBarSO.switcher.isDisplayed()).toBe(true);
          });
        });
      });
    });
  });
});
