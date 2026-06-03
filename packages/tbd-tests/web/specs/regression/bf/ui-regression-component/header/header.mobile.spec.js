const {
  GenericPagePO,
  FooterPO,
  HeaderPO,
  BottomBarPO,
  SectionElementsPO,
  AvBFixturePO,
  FootballScoreboardPO,
  TeamPO,
} = require("../../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const genericPagePO = new GenericPagePO();
const headerPO = new HeaderPO();
const fixture = new AvBFixturePO();
const footballScoreboardPO = new FootballScoreboardPO();
const scoreboardHomeTeamPO = new TeamPO(footballScoreboardPO.homeTeam);

const footerPO = new FooterPO();
const footerPOFirstSection = new SectionElementsPO(footerPO.sections[0]);
const bottomBarPO = new BottomBarPO();

const BOTTOM_BAR = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: routes.getHomeViewUrl(),
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:browse",
        viewUrl: routes.getBrowseViewUrl(),
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
        viewUrl: routes.getGamingViewUrl("1"),
      },
    },
  ],
};

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR,
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
                viewLink: {
                  viewUrn: "ppb:tbd:view:event:29753184",
                  viewUrl: routes.getEventViewUrl("29753184"),
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Brazilian Brasiliense Matches",
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topInplayEventsInSport:1",
        cardGroupTitle: "In-Play",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753238",
                viewLink: {
                  viewUrn: "ppb:tbd:view:event:29753238",
                  viewUrl: routes.getEventViewUrl("29753238"),
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Brazilian Brasiliense Matches",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170181877",
                      liveData: {
                        totalMatched: 59768.0349898696,
                        state: "OPEN",
                        inplay: true,
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
                          urn: "ppb:competition:857992",
                          name: "Chilean Primera B",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753238",
                          name: "Union San Felipe v Club Deportes Santa Cruz",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181877/4966011/0",
                          name: "Union San Felipe",
                          selectionId: 4966011,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181877/11023627/0",
                          name: "Club Deportes Santa Cruz",
                          selectionId: 11023627,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181877/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170181877/4966011/0" },
                      { runnerURN: "ppb:excRunner:1.170181877/11023627/0" },
                      { runnerURN: "ppb:excRunner:1.170181877/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753238",
                  home: {
                    name: "Union San Felipe",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Club Deportes Santa Cruz",
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
                urn: "ppb:tbd:card:eventPrimaryMarket:29753238",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "RegulatoryCard",
        urn: "ppb:tbd:card:regulatory",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
          },
        ],
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topInplayEventsInSport:1",
      },
    },
    {
      node: {
        __typename: "RegulatoryCard",
        urn: "ppb:tbd:card:regulatory",
      },
    },
  ],
};

const BFF_HOME_VIEW_MOCK_UPDATE = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:833222",
        cardGroupTitle: "Turkish 2 Lig",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753358",
                viewLink: {
                  viewUrn: "ppb:tbd:view:event:29753358",
                  viewUrl: routes.getEventViewUrl("29753358"),
                },
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12348",
                  __typename: "SportsEvent",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:833222",
                    name: "Turkish 2 Lig",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170184696",
                      liveData: {
                        totalMatched: 1156.3838597477095,
                        state: "OPEN",
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
                          urn: "ppb:competition:833222",
                          name: "Turkish 2 Lig",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753358",
                          name: "Hekimoglu Trabzon v Kirklarelispor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170184696/21174821/0",
                          name: "Hekimoglu Trabzon",
                          selectionId: 21174821,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170184696/5340310/0",
                          name: "Kirklarelispor",
                          selectionId: 5340310,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170184696/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170184696/21174821/0" },
                      { runnerURN: "ppb:excRunner:1.170184696/5340310/0" },
                      { runnerURN: "ppb:excRunner:1.170184696/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753358",
                  home: {
                    name: "Hekimoglu Trabzon",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Kirklarelispor",
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
                urn: "ppb:tbd:card:eventPrimaryMarket:29753358",
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
        urn: "ppb:tbd:card:group:topEventsByCompetition:833222",
      },
    },
  ],
};

describe("In the Home page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_HOME_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
    await browser.url(routes.getHomeViewUrl());
    await browser.waitUntilDisplayed(fixture.element);
  });

  it("[PRPI-5949] Two football swimlanes are visible", async () => {
    expect(await genericPagePO.scrollableSwimlanes.length).toBe(2);
  });

  describe("When I scroll down till TBD footer And I tap the 'Logo' tile", () => {
    beforeAll(async () => {
      await footerPOFirstSection.element.scrollIntoView({ inline: "end" });
      await browser.waitUntilInViewport(footerPOFirstSection.element);
      await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK_UPDATE));
      await headerPO.logo.click();
      await browser.waitUntilEquals(scoreboardHomeTeamPO.name, "Hekimoglu Trabzon");
    });

    it("[PRPI-5950] \u200BThen I should see the 'Home' tile with a selected state", async () => {
      expect(await bottomBarPO.activeTileTitle.getText()).toBe("Home");
    });

    it("[PRPI-5951] And I should see that homepage is updated and a\xA0new football swimlane is visible", async () => {
      expect(await genericPagePO.scrollableSwimlanes[0].isDisplayedInViewport()).toBe(true);
      expect(await genericPagePO.scrollableSwimlanes.length).toBe(1);
    });
  });
});
