const { SportPagePO, ScrollableSwimlanePO } = require("../../../../../page-objects");
const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const firstPrimarySwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "UEFA Champions League",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29744375",
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
                      urn: "ppb:excMarket:1.169998771",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.227925260",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29744375",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "1" },
                  away: { name: "2" },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29742063",
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
                      urn: "ppb:excMarket:1.169920811",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29742063",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "3" },
                  away: { name: "4" },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29748960",
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
                      urn: "ppb:excMarket:1.170169873",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228258731",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29748960",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "5" },
                  away: { name: "6" },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29749610",
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
                      urn: "ppb:excMarket:1.170128247",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228308083",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29749610",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "7" },
                  away: { name: "8" },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29744375" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29742063" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29748960" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29749610" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29751156" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29748961" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29752856" } },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29744374",
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
                      urn: "ppb:excMarket:1.169998771",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.227925260",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                    runners: [{ runnerURN: "urn" }],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29744374",
                  scheduledAt: "2020-02-01T12:30",
                  startedAt: "2020-02-01T12:30",
                  home: { name: "1" },
                  away: { name: "2" },
                },
              },
            },
          ],
        },
        partials: {
          edges: [{ node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29744374" } }],
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
  ],
};

const CARDS_MOCK = {
  cards: [
    {
      __typename: "EventMarketCard",
      urn: "ppb:tbd:card:eventPrimaryMarket:29751156",
    },
    {
      __typename: "EventMarketCard",
      urn: "ppb:tbd:card:eventPrimaryMarket:29748961",
    },
    {
      __typename: "EventMarketCard",
      urn: "ppb:tbd:card:eventPrimaryMarket:29752856",
    },
  ],
};

describe("Given I am on the Football Sports Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getCardResults(CARDS_MOCK, { statusCode: 404 }));

    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(await firstPrimarySwimlanePO.title);
    await browser.waitUntilDisplayed(await sportPagePO.primaryEventCards[0]);
  });

  it("[PRPI-6282] Then I should see a swimlane with the\xA0title 'UEFA Champions League'", async () => {
    expect(await firstPrimarySwimlanePO.title.getText()).toBe("UEFA Champions League");
  });

  describe("[628844] And I have 4 full cards and 7 partial cards for 'UEFA Champions League' primary swimlane", () => {
    it("[PRPI-6283] Then I should see 'UEFA Champions League' swimlane with a total of 7 cards at page load", async () => {
      expect(await firstPrimarySwimlanePO.scrollItems.length).toBe(7);
      expect(await firstPrimarySwimlanePO.title.getText()).toBe("UEFA Champions League");
    });

    it("[PRPI-6284] Then I should see 'UEFA Champions League' swimlane with a total of 3 placeholders at page load", async () => {
      expect(await firstPrimarySwimlanePO.scrollItemsPlaceholders.length).toBe(3);
    });
  });
});
