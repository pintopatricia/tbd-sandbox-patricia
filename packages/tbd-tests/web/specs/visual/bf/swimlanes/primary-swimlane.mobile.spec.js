const { SportPagePO, ScrollableSwimlanePO } = require("../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const swimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const thirdEventMarketCardPO = new EventMarketCardPO(swimlanePO.scrollItems[2]);
const fifthEventMarketCardPO = new EventMarketCardPO(swimlanePO.scrollItems[4]);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_MOCK_1_EVENT = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "UEFA Champions League",
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
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Man Utd vs Wolves",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    name: "Australian A-League",
                    competitionId: 1,
                    urn: "ppb:competition:1",
                  },
                },
                fixture: {
                  urn: `ppb:fixture:29359895`,
                  home: {
                    name: "Wolves",
                    color: "091453",
                    crest: {
                      vector: null,
                    },
                  },
                  away: {
                    name: "Man Utd",
                    color: "FC5002",
                    crest: {
                      vector: null,
                    },
                  },
                  scheduledAt: "2010-10-14T18:45Z",
                  score: null,
                  duration: null,
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Wolves v Man Utd",
                          urn: `ppb:event:29359895`,
                        },
                        competition: {
                          name: "Australian A-League",
                          competitionId: 1,
                          urn: "ppb:competition:1",
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

const BFF_MOCK_5_EVENT = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topInplayEventsInSport:2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359899",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Porto v Benfica",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    name: "Australian A-League",
                    competitionId: 1,
                    urn: "ppb:competition:1",
                  },
                },
                fixture: {
                  urn: `ppb:fixture:29359895`,
                  home: {
                    name: "Porto",
                    color: "091453",
                    crest: {
                      vector: null,
                    },
                  },
                  away: {
                    name: "Benfica",
                    color: "FC5002",
                    crest: {
                      vector: null,
                    },
                  },
                  scheduledAt: "2010-10-14T18:45Z",
                  score: null,
                  duration: null,
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Porto v Benfica",
                          urn: `ppb:event:29359895`,
                        },
                        competition: {
                          name: "Australian A-League",
                          competitionId: 1,
                          urn: "ppb:competition:1",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48045/0",
                          selectionId: 48045,
                          name: "Porto",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48352/0",
                          selectionId: 48352,
                          name: "Benfica",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58806/0",
                          selectionId: 58806,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48045/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48352/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58806/0" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Man Utd vs Wolves",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                fixture: {
                  urn: `ppb:fixture:29359896`,
                  home: {
                    name: "Man Utd",
                    color: "091453",
                    crest: {
                      vector: null,
                    },
                  },
                  away: {
                    name: "Wolves",
                    color: "FC5002",
                    crest: {
                      vector: null,
                    },
                  },
                  scheduledAt: "2010-10-14T18:45Z",
                  score: null,
                  duration: null,
                },
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
                          urn: `ppb:event:29359896`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48045/0",
                          selectionId: 48045,
                          name: "Man Utd",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48352/0",
                          selectionId: 48352,
                          name: "Wolves",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58806/0",
                          selectionId: 58806,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48045/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48352/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58806/0" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
                title: "Sporting vs Boavista",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    name: "Australian A-League",
                    competitionId: 1,
                    urn: "ppb:competition:1",
                  },
                },
                fixture: {
                  urn: `ppb:fixture:29359897`,
                  home: {
                    name: "Sporting",
                    color: "091453",
                    crest: {
                      vector: null,
                    },
                  },
                  away: {
                    name: "Boavista",
                    color: "FC5002",
                    crest: {
                      vector: null,
                    },
                  },
                  scheduledAt: "2010-10-14T18:45Z",
                  score: null,
                  duration: null,
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Sporting v Boavista",
                          urn: `ppb:event:29359897`,
                        },
                        competition: {
                          name: "Australian A-League",
                          competitionId: 1,
                          urn: "ppb:competition:1",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48045/0",
                          selectionId: 48045,
                          name: "Sporting",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48352/0",
                          selectionId: 48352,
                          name: "Boavista",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58806/0",
                          selectionId: 58806,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48045/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48352/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58806/0" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
                title: "Real Madrid vs Barcelona",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    name: "Australian A-League",
                    competitionId: 1,
                    urn: "ppb:competition:1",
                  },
                },
                fixture: {
                  urn: `ppb:fixture:29359898`,
                  home: {
                    name: "Real Madrid",
                    color: "091453",
                    crest: {
                      vector: null,
                    },
                  },
                  away: {
                    name: "Barcelona",
                    color: "FC5002",
                    crest: {
                      vector: null,
                    },
                  },
                  scheduledAt: "2010-10-14T18:45Z",
                  score: null,
                  duration: null,
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Real Madrid v Barcelona",
                          urn: `ppb:event:29359898`,
                        },
                        competition: {
                          name: "Australian A-League",
                          competitionId: 1,
                          urn: "ppb:competition:1",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48045/0",
                          selectionId: 48045,
                          name: "Real Madrid",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48352/0",
                          selectionId: 48352,
                          name: "Barcelona",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58806/0",
                          selectionId: 58806,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48045/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48352/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58806/0" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359899",
                title: "Everton vs Man City",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    name: "Australian A-League",
                    competitionId: 1,
                    urn: "ppb:competition:1",
                  },
                },
                fixture: {
                  urn: `ppb:fixture:29359899`,
                  home: {
                    name: "Everton",
                    color: "091453",
                    crest: {
                      vector: null,
                    },
                  },
                  away: {
                    name: "Man City",
                    color: "FC5002",
                    crest: {
                      vector: null,
                    },
                  },
                  scheduledAt: "2010-10-14T18:45Z",
                  score: null,
                  duration: null,
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Everton v Man City",
                          urn: `ppb:event:29359899`,
                        },
                        competition: {
                          name: "Australian A-League",
                          competitionId: 1,
                          urn: "ppb:competition:1",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48045/0",
                          selectionId: 48045,
                          name: "Everton",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48352/0",
                          selectionId: 48352,
                          name: "Man City",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58806/0",
                          selectionId: 58806,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48045/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48352/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58806/0" },
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
        urn: "ppb:tbd:card:group:topInplayEventsInSport:2",
      },
    },
  ],
};

const MODULE_NAME = "primary-swimlane";

describe("Given I am on the Football Sports Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_1_EVENT.urn, { disableCSSAnimations: true }));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_1_EVENT));
    await mockService.mockHttpRequest(getScaResponse({}));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1575]_should_render_swimlane_with_1_event`);
  });

  it("[PRPI-1575]_should_render_swimlane_with_1_event", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1575]_should_render_swimlane_with_1_event`)).toEqual(0);
  });
});

describe("Given I am on the Football Sports Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_5_EVENT.urn, { disableCSSAnimations: true }));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_5_EVENT));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1576]_should_render_first_and_partially_second`);
  });

  it("[PRPI-1576]_should_render_first_and_partially_second", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1576]_should_render_first_and_partially_second`)).toEqual(0);
  });

  describe("When I swipe to the 3rd event ", () => {
    beforeAll(async () => {
      await thirdEventMarketCardPO.element.scrollIntoView({ inline: "start" });
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1577]_should_render_third_and_partially_fourth`);
    });

    it("[PRPI-1577]_should_render_third_and_partially_fourth", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1577]_should_render_third_and_partially_fourth`)).toEqual(
        0,
      );
    });

    describe("When I swipe to the last event ", () => {
      beforeAll(async () => {
        await fifthEventMarketCardPO.element.scrollIntoView({ inline: "end" });
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1578]_should_render_fith_and_partially_fourth`);
      });

      it("[PRPI-1578]_should_render_fith_and_partially_fourth", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1578]_should_render_fith_and_partially_fourth`)).toEqual(
          0,
        );
      });
    });
  });
});
